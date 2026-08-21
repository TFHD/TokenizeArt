# 42 TokenizerArt

## Description du projet

**42 TokenizerArt** est un projet pédagogique visant à comprendre le fonctionnement des **NFT** sur blockchain, de leur conception jusqu’à leur mint via une interface web.

Ce projet consiste en la création et le déploiement d’une collection **ERC-721** sur le réseau de test **Ethereum Sepolia**, avec un site Svelte pour connecter MetaMask et minter.

- **Nom** : 42 Sabartho NFT
- **Symbole (ticker)** : SBNFT
- **Standard** : ERC-721
- **Réseau** : Sepolia (Ethereum Testnet)
- **Adresse du smart contract** : `0xb9A9E8871CC5275f2E0804e547C12AE431024A6A`
- **Explorateur** : [sepolia.etherscan.io](https://sepolia.etherscan.io/address/0xb9A9E8871CC5275f2E0804e547C12AE431024A6A)
- **Métadonnées** : IPFS (`ipfs://bafybeif7pcyhivbgxeu4gtmy3fdkocq2ra7fayzxmtvlkqhpjwqh7iycoe/{tokenId}.json`)

La documentation complète (utilisation, déploiement, sécurité, bonus) se trouve dans [`documentation/`](./documentation/).

---

## Objectifs pédagogiques

- Comprendre ce qu’est un NFT et en quoi il diffère d’un token fongible (ERC-20)
- Apprendre le standard ERC-721
- Écrire un contrat en Solidity avec OpenZeppelin
- Héberger des métadonnées / images sur IPFS
- Déployer un smart contract sur un réseau public de test
- Interagir via MetaMask, Etherscan et une dApp (Svelte)

---

## Choix de la stack (et alternatives écartées)

### Langage : Solidity

Les smart contracts Ethereum se programment principalement en **Solidity**. C’est le langage le plus documenté, celui d’OpenZeppelin, et celui attendu par Hardhat.

### Standard : ERC-721

Chaque jeton de la collection est unique (un `tokenId`, une `tokenURI`).

| Standard | Usage | Pourquoi pas ici |
|---|---|---|
| ERC-20 | Tokens fongibles (1 token = 1 token) | Hors sujet : on veut des œuvres uniques |
| **ERC-721** | NFT (chaque token est unique) | **Choisi** |
| ERC-1155 | Mix fongible / non-fongible | Plus complexe, inutile pour une petite collection |

### Plateforme de développement

| Outil | Intérêt | Limite |
|---|---|---|
| Remix | Tester dans le navigateur | Peu adapté à un vrai repo (scripts, config, dApp) |
| Foundry | Très rapide, tests en Solidity | Courbe plus raide pour le front TS |
| **Hardhat 3** | Compile, scripts TS, Sepolia, verify | **Choisi** |

### Front : SvelteKit

Une dApp minimale (connexion MetaMask + `safeMint`) en **Svelte 5** + **ethers v6**. Pas de backend : le navigateur parle à MetaMask, qui signe, le contrat s’exécute on-chain.

### Bibliothèque : OpenZeppelin

`ERC721` + `Ownable` audités. Le projet se concentre sur le mint owner-only et les métadonnées IPFS, pas sur la réécriture du standard.

### Réseau : Ethereum Sepolia

Testnet officiel, faucets, Etherscan. Gratuit, proche du mainnet.

---

## Structure du dépôt

```
README.md
code/token/          # contrat Solidity, Hardhat, .env.example
code/web/            # dApp SvelteKit (mint MetaMask)
deployment/          # script de déploiement (aucune clé en clair)
documentation/       # utilisation, technique, sécurité, explorateur
```
