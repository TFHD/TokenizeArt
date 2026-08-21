# Whitepaper - 42 Sabartho NFT (SBNFT)

## 1. Introduction

**42 Sabartho NFT** (ticker **SBNFT**) is an **ERC-721** collection deployed on the Ethereum Sepolia testnet.

It was created for the educational project **42 TokenizerArt**. The goal is to understand:

- How an NFT works on a blockchain
- The ERC-721 standard
- Linking a token to metadata / artwork (IPFS)
- Smart contract deployment
- Minting through a wallet (MetaMask) and a web UI

## 2. What the token represents

Each SBNFT is a **non-fungible** token: a unique `tokenId` and a unique `tokenURI` (`…/{id}.json` on IPFS).

The collection has **no real monetary value**. It is a test project.

## 3. Token specifications

| Property | Value |
|---|---|
| Name | **42 Sabartho NFT** (must contain `42`) |
| Symbol (ticker) | SBNFT |
| Standard | ERC-721 |
| Mint | `safeMint(address to)` — owner only |
| IDs | Start at `1`, incremented on each mint |
| Metadata | `ipfs://bafybeif7pcyhivbgxeu4gtmy3fdkocq2ra7fayzxmtvlkqhpjwqh7iycoe/{tokenId}.json` |
| Network | Sepolia (Ethereum Testnet) |

## 4. Intended use

- Owner-only minting (`safeMint`)
- Reading `tokenURI` / `ownerOf` / `balanceOf` on the explorer
- Display in MetaMask once minted
- Standard ERC-721 transfers (`transferFrom` / `safeTransferFrom`)
- Optional ownership transfer to a Gnosis Safe (bonus)

## 5. Philosophy

SBNFT is not a speculative project. It is an **educational tool** to demystify creating an NFT and minting it on a public blockchain.
