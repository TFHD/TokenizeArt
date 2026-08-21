# Comment utiliser le NFT SBNFT

## Prérequis

- Un wallet EVM (MetaMask recommandé)
- Réseau **Sepolia** (chain ID `11155111`)
- Un peu d’ETH Sepolia (faucet) pour le gas

Contrat : `0xb9A9E8871CC5275f2E0804e547C12AE431024A6A`

Explorateur : [https://sepolia.etherscan.io/address/0xb9A9E8871CC5275f2E0804e547C12AE431024A6A](https://sepolia.etherscan.io/address/0xb9A9E8871CC5275f2E0804e547C12AE431024A6A)

## 1. Minter depuis la dApp (recommandé)

```bash
cd code/web
cp .env.example .env   # PUBLIC_NFT_ADDRESS=0xb9A9E8871CC5275f2E0804e547C12AE431024A6A
npm install
npm run dev
```

Ouvre l’URL locale (souvent `http://localhost:5173`) :

1. **Connecter MetaMask** (réseau Sepolia)
2. Si besoin, **Passer sur Sepolia**
3. Indiquer le **destinataire** (prérempli avec ton adresse)
4. **Minter** — MetaMask demande une signature

`safeMint` est `onlyOwner` : il faut le wallet qui a déployé le contrat. Un autre compte voit le bouton désactivé / un revert `OwnableUnauthorizedAccount`.

Après confirmation, un lien **Etherscan** s’affiche.

## 2. Minter depuis Etherscan

1. Page du contrat → **Contract** → **Write Contract** → **Connect to Web3**
2. Appeler `safeMint(to)` avec l’adresse du destinataire
3. Le wallet connecté **doit** être l’owner

## 3. Voir le NFT dans MetaMask

1. MetaMask → réseau **Sepolia** → onglet **NFTs**
2. Après le mint, le token devrait apparaître (parfois après un import manuel de l’adresse du contrat)
3. L’image / le nom viennent de `tokenURI` → JSON IPFS

Gateway exemple :  
`https://ipfs.io/ipfs/bafybeif7pcyhivbgxeu4gtmy3fdkocq2ra7fayzxmtvlkqhpjwqh7iycoe/1.json`

## 4. Transférer un NFT

Tout détenteur peut transférer **son** token (pas besoin d’être owner) :

- MetaMask → NFT → envoyer, ou
- Etherscan → `safeTransferFrom(from, to, tokenId)`

## 5. Lire sur l’explorateur

| Onglet / champ | Ce que tu vois |
|---|---|
| Nom / ticker | 42 Sabartho NFT / SBNFT |
| **Read** `name` / `symbol` / `owner` / `ownerOf` / `tokenURI` / `balanceOf` | État on-chain |
| **Write** | `safeMint`, `setBaseURI`, `transferOwnership`, transferts ERC-721 |
| Events | `Transfer`, `OwnershipTransferred` |

## 6. Actions possibles (résumé)

| Action | Qui | Fonction |
|---|---|---|
| Voir le propriétaire d’un token | Tout le monde | `ownerOf` |
| Voir les métadonnées | Tout le monde | `tokenURI` |
| Minter | **Owner uniquement** | `safeMint` |
| Changer la base IPFS | **Owner uniquement** | `setBaseURI` |
| Transférer un NFT | Détenteur (ou opérateur approuvé) | `safeTransferFrom` |
| Changer d’owner | **Owner uniquement** | `transferOwnership` |
