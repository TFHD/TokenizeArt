# Sécurité & ownership

Le NFT n’invente pas un système d’accès maison. Il s’appuie sur **Ownable** et **ERC721** d’OpenZeppelin.

## Qui est l’owner ?

Au déploiement, `Ownable(msg.sender)` place le **déployeur** comme owner. Cette adresse est on-chain et se lit avec `owner()` (Etherscan → Read Contract, ou la dApp).

Après l’étape bonus, l’owner peut être un **Gnosis Safe** (voir [multisig.md](./multisig.md)). Le modèle de privilèges ne change pas : seules les fonctions `onlyOwner` sont réservées à `owner()`.

## Privilèges

| Fonction | Restriction | Effet |
|---|---|---|
| `safeTransferFrom` / `transferFrom` / `approve` | Détenteur ou opérateur | Déplacer ou autoriser un NFT |
| `safeMint(to)` | `onlyOwner` | Créer un nouveau token |
| `setBaseURI` | `onlyOwner` | Changer le préfixe IPFS |
| `transferOwnership(newOwner)` | `onlyOwner` | Changer d’owner |
| `renounceOwnership()` | `onlyOwner` | Owner = `address(0)`. **Plus aucun mint possible.** |

Un détenteur lambda **ne peut pas** minter ni changer la `baseURI`. Il peut transférer les NFT qu’il possède.

La dApp **n’embarque jamais** la clé privée : MetaMask signe. `PUBLIC_NFT_ADDRESS` est une adresse publique, pas un secret.

## Mauvais usage

OpenZeppelin revert (la tx échoue, l’état ne change pas) :

- `safeMint` par un non-owner → `OwnableUnauthorizedAccount`
- `tokenURI` / transfert d’un `tokenId` inexistant → token inexistant
- transfert d’un NFT dont on n’est pas owner (sans approval) → rejeté

Aucune clé API / privée dans le contrat ni dans `deployment/`. Les secrets restent dans `code/token/.env` (gitignoré).

## Pourquoi OpenZeppelin

Un ERC-721 écrit à la main oublie souvent `_requireOwned`, les réceptions `onERC721Received`, ou les race conditions d’approval. Utiliser `ERC721` et `Ownable` audités est le choix de sécurité du projet.
