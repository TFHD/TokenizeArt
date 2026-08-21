import { PUBLIC_NFT_ADDRESS } from '$env/static/public';

export const CONTRACT_ADDRESS = PUBLIC_NFT_ADDRESS;

export const SEPOLIA = {
	chainId: 11155111,
	chainIdHex: '0xaa36a7',
	name: 'Sepolia',
	rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
	explorer: 'https://sepolia.etherscan.io',
	nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 }
} as const;

export const NFT_ABI = [
	'function name() view returns (string)',
	'function owner() view returns (address)',
	'function safeMint(address to)',
	'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
	'error OwnableUnauthorizedAccount(address account)'
];

export function explorerTx(hash: string) {
	return `${SEPOLIA.explorer}/tx/${hash}`;
}

export function shortenAddress(address: string) {
	return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
