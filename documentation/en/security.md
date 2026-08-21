# Security & ownership

The NFT is not a custom access-control system. It uses OpenZeppelin **Ownable** on top of **ERC721**.

## Who is the owner?

At deployment, `Ownable(msg.sender)` sets the **deployer** as owner. That address is stored on-chain and can be read with `owner()` (Etherscan → Read Contract, or the dApp).

After the bonus step, the owner can become a **Gnosis Safe** (see [multisig.md](./multisig.md)). The privilege model does not change: only `owner()` may call `onlyOwner` functions.

## Privileges

| Function | Restriction | Effect |
|---|---|---|
| `safeTransferFrom` / `transferFrom` / `approve` | Holder or operator | Move or authorize an NFT |
| `safeMint(to)` | `onlyOwner` | Create a new token |
| `setBaseURI` | `onlyOwner` | Change the IPFS prefix |
| `transferOwnership(newOwner)` | `onlyOwner` | Change owner |
| `renounceOwnership()` | `onlyOwner` | Owner = `address(0)`. **Mint becomes impossible forever.** |

A random holder **cannot** mint or change the `baseURI`. They can transfer NFTs they own.

The dApp **never embeds** a private key: MetaMask signs. `PUBLIC_NFT_ADDRESS` is a public address, not a secret.

## What happens on bad usage

OpenZeppelin reverts (transaction fails, state unchanged):

- `safeMint` from a non-owner → `OwnableUnauthorizedAccount`
- `tokenURI` / transfer of a non-existent `tokenId` → token does not exist
- transfer of an NFT you do not own (without approval) → rejected

No secret, API key or private key belongs in the contract or in `deployment/`. Keys stay in `code/token/.env`, which is gitignored.

## Why OpenZeppelin

A hand-rolled ERC-721 often misses `_requireOwned`, `onERC721Received`, or approval race conditions. Using audited `ERC721` and `Ownable` is the security choice for this project.
