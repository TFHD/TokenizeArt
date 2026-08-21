# Technical documentation & deployment

## Tech stack

| Technology | Role |
|---|---|
| Solidity 0.8.28 | Smart contract language |
| OpenZeppelin | `ERC721` + `Ownable` |
| Hardhat 3 | Compile, deploy, verify |
| SvelteKit + ethers v6 | Mint dApp (MetaMask) |
| IPFS | Metadata and media |
| Sepolia | Ethereum testnet |
| MetaMask | Wallet |
| Etherscan | Block explorer |

## Contract structure

`SabarthoNFT` inherits:

- `ERC721` → `ownerOf`, `balanceOf`, `safeTransferFrom`, `tokenURI` (overridden), …
- `Ownable` → `owner()`, `onlyOwner`, `transferOwnership`

Extra functions:

- `safeMint(address to)` → owner only, IDs auto-increment from 1
- `setBaseURI(string)` → owner only, IPFS prefix
- `tokenURI(uint256)` → `{baseURI}{tokenId}.json` if the token exists

The constructor takes **no argument**: `ERC721("42 Sabartho NFT", "SBNFT")` and `Ownable(msg.sender)`.

## How to deploy

Secrets never live in `deployment/`. They stay in `code/token/.env` (gitignored).

```bash
cd code/token
cp .env.example .env
./scripts/install.sh   # npm install + symlink to deployment/node_modules
```

| Variable | Meaning |
|---|---|
| `PRIVATE_KEY` | Deployer wallet |
| `SEPOLIA_RPC_URL` | Sepolia RPC, e.g. `https://ethereum-sepolia-rpc.publicnode.com` |
| `ETHERSCAN_API_KEY` | Optional, for `npm run verify` |
| `NTF_ADDRESS` | NFT address once deployed |
| `WALLET_ADDRESS` | Address used for minting / tests |
| `IPFS_CID` | CID of the metadata folder |

Then:

```bash
cd code/token
npm run compile
npm run deploy
```

`npm run deploy` runs `hardhat run ../deployment/deploy.ts --network sepolia`.

The script deploys `SabarthoNFT` with no constructor argument. On success it prints the address. Update:

- the docs / `NTF_ADDRESS` in `code/token/.env`
- `PUBLIC_NFT_ADDRESS` in `code/web/.env`

Optional verification on Etherscan (no constructor args):

```bash
npm run verify -- 0xYourContractAddress
```

The deployer needs Sepolia ETH for gas.

## Run the dApp

```bash
cd code/web
cp .env.example .env
# PUBLIC_NFT_ADDRESS=0x...
npm install
npm run dev
```

Hardhat 3: the mocha-ethers plugin must be registered in `hardhat.config.ts` (`plugins: [...]`). The deploy script uses `network.create()` then `ethers.deployContract("SabarthoNFT")`.

## Project layout

```
code/token/contracts/Token.sol   # SabarthoNFT contract
code/token/hardhat.config.ts     # network via env vars
code/web/                        # mint UI
deployment/deploy.ts             # deploy script (no secrets)
```
