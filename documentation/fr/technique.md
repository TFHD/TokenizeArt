# Documentation technique & déploiement

## Stack

| Technologie | Rôle |
|---|---|
| Solidity 0.8.28 | Langage du smart contract |
| OpenZeppelin | `ERC721` + `Ownable` |
| Hardhat 3 | Compilation, déploiement, verify |
| SvelteKit + ethers v6 | dApp de mint (MetaMask) |
| IPFS | Métadonnées et médias |
| Sepolia | Testnet Ethereum |
| MetaMask | Wallet |
| Etherscan | Explorateur |

## Structure du contrat

`SabarthoNFT` hérite de :

- `ERC721` → `ownerOf`, `balanceOf`, `safeTransferFrom`, `tokenURI` (surchargée), …
- `Ownable` → `owner()`, `onlyOwner`, `transferOwnership`

Fonctions ajoutées :

- `safeMint(address to)` → owner uniquement, IDs auto-incrémentés depuis 1
- `setBaseURI(string)` → owner uniquement, préfixe IPFS
- `tokenURI(uint256)` → `{baseURI}{tokenId}.json` si le token existe

Le constructeur n’a **pas d’argument** : `ERC721("42 Sabartho NFT", "SBNFT")` et `Ownable(msg.sender)`.

## Comment déployer

Aucune clé dans `deployment/`. Les secrets restent dans `code/token/.env` (gitignoré).

```bash
cd code/token
cp .env.example .env
./scripts/install.sh   # npm install + lien symbolique vers deployment/node_modules
```

| Variable | Rôle |
|---|---|
| `PRIVATE_KEY` | Wallet du déployeur |
| `SEPOLIA_RPC_URL` | RPC Sepolia, ex. `https://ethereum-sepolia-rpc.publicnode.com` |
| `ETHERSCAN_API_KEY` | Optionnel, pour `npm run verify` |
| `NTF_ADDRESS` | Adresse du NFT une fois déployé |
| `WALLET_ADDRESS` | Adresse utilisée pour minter / tests |
| `IPFS_CID` | CID du dossier de métadonnées |

Puis :

```bash
cd code/token
npm run compile
npm run deploy
```

`npm run deploy` exécute `hardhat run ../deployment/deploy.ts --network sepolia`.

Le script déploie `SabarthoNFT` sans argument de constructeur. En cas de succès, l’adresse s’affiche. Mettre à jour :

- la doc / `NTF_ADDRESS` dans `code/token/.env`
- `PUBLIC_NFT_ADDRESS` dans `code/web/.env`

Vérification optionnelle sur Etherscan (pas d’argument constructeur) :

```bash
npm run verify -- 0xAdresseDuContrat
```

Le déployeur doit avoir de l’ETH Sepolia pour le gas.

## Lancer la dApp

```bash
cd code/web
cp .env.example .env
# PUBLIC_NFT_ADDRESS=0x...
npm install
npm run dev
```

Hardhat 3 : le plugin mocha-ethers doit être déclaré dans `hardhat.config.ts` (`plugins: [...]`). Le script de deploy utilise `network.create()` puis `ethers.deployContract("SabarthoNFT")`.

## Organisation du projet

```
code/token/contracts/Token.sol   # contrat SabarthoNFT
code/token/hardhat.config.ts     # réseau via variables d'environnement
code/web/                        # interface de mint
deployment/deploy.ts             # script de deploy (aucune clé)
```
