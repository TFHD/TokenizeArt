# How to use the SBNFT

## Prerequisites

- An EVM wallet (MetaMask recommended)
- Network **Sepolia** selected (chain ID `11155111`)
- A little Sepolia ETH (faucet) for gas

Contract: `0xb9A9E8871CC5275f2E0804e547C12AE431024A6A`

Explorer: [https://sepolia.etherscan.io/address/0xb9A9E8871CC5275f2E0804e547C12AE431024A6A](https://sepolia.etherscan.io/address/0xb9A9E8871CC5275f2E0804e547C12AE431024A6A)

## 1. Mint from the dApp (recommended)

```bash
cd code/web
cp .env.example .env   # PUBLIC_NFT_ADDRESS=0xb9A9E8871CC5275f2E0804e547C12AE431024A6A
npm install
npm run dev
```

Open the local URL (usually `http://localhost:5173`):

1. **Connect MetaMask** (Sepolia)
2. **Switch to Sepolia** if needed
3. Set the **recipient** (pre-filled with your address)
4. **Mint** — MetaMask asks for a signature

`safeMint` is `onlyOwner`: you must use the wallet that deployed the contract. Another account sees a disabled button / an `OwnableUnauthorizedAccount` revert.

After confirmation, an **Etherscan** link is shown.

## 2. Mint from Etherscan

1. Contract page → **Contract** → **Write Contract** → **Connect to Web3**
2. Call `safeMint(to)` with the recipient address
3. The connected wallet **must** be the owner

## 3. See the NFT in MetaMask

1. MetaMask → **Sepolia** → **NFTs** tab
2. After minting, the token should appear (sometimes after importing the contract address)
3. Image / name come from `tokenURI` → IPFS JSON

Example gateway:  
`https://ipfs.io/ipfs/bafybeif7pcyhivbgxeu4gtmy3fdkocq2ra7fayzxmtvlkqhpjwqh7iycoe/1.json`

## 4. Transfer an NFT

Any holder can transfer **their** token (no need to be owner):

- MetaMask → NFT → send, or
- Etherscan → `safeTransferFrom(from, to, tokenId)`

## 5. Read on the explorer

| Tab / field | What you see |
|---|---|
| Name / ticker | 42 Sabartho NFT / SBNFT |
| **Read** `name` / `symbol` / `owner` / `ownerOf` / `tokenURI` / `balanceOf` | On-chain state |
| **Write** | `safeMint`, `setBaseURI`, `transferOwnership`, ERC-721 transfers |
| Events | `Transfer`, `OwnershipTransferred` |

## 6. Possible actions (summary)

| Action | Who | Function |
|---|---|---|
| See a token’s owner | Anyone | `ownerOf` |
| See metadata | Anyone | `tokenURI` |
| Mint | **Owner only** | `safeMint` |
| Change IPFS base | **Owner only** | `setBaseURI` |
| Transfer an NFT | Holder (or approved operator) | `safeTransferFrom` |
| Change owner | **Owner only** | `transferOwnership` |
