# Plan d'action - 42 Sabartho NFT (SBNFT)

## 1. Introduction

**42 Sabartho NFT** (ticker **SBNFT**) est une collection **ERC-721** déployée sur le réseau de test Ethereum Sepolia.

Elle a été créée dans le cadre du projet pédagogique **42 TokenizerArt**. Objectif :

- Comprendre le fonctionnement d’un NFT
- Apprendre le standard ERC-721
- Lier un token à des métadonnées / une image (IPFS)
- Déployer un smart contract
- Minter via un wallet (MetaMask) et une interface web

## 2. Représentation

Chaque SBNFT est un jeton **non fongible** : un `tokenId` unique, une `tokenURI` unique (`…/{id}.json` sur IPFS).

La collection n’a **aucune valeur monétaire réelle**. C’est un projet de test.

## 3. Caractéristiques

| Propriété | Valeur |
|---|---|
| Nom | **42 Sabartho NFT** (contient `42`) |
| Symbole (ticker) | SBNFT |
| Standard | ERC-721 |
| Mint | `safeMint(address to)` — owner uniquement |
| IDs | Commencent à `1`, incrémentés à chaque mint |
| Métadonnées | `ipfs://bafybeif7pcyhivbgxeu4gtmy3fdkocq2ra7fayzxmtvlkqhpjwqh7iycoe/{tokenId}.json` |
| Réseau | Sepolia (Ethereum Testnet) |

## 4. Utilisation prévue

- Mint réservé à l’owner (`safeMint`)
- Consultation de `tokenURI` / `ownerOf` / `balanceOf` sur l’explorateur
- Affichage dans MetaMask (NFT) une fois minté
- Transfert ERC-721 standard (`transferFrom` / `safeTransferFrom`)
- Transfert optionnel de l’ownership vers un Gnosis Safe (bonus)

## 5. Philosophie

SBNFT n’est pas un projet spéculatif. C’est un **outil pédagogique** pour démystifier la création d’un NFT et son mint sur une blockchain publique.
