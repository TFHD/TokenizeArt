import { browser } from '$app/environment';
import {
	BrowserProvider,
	Contract,
	isAddress,
	type Eip1193Provider,
	type TransactionReceipt
} from 'ethers';
import { CONTRACT_ADDRESS, NFT_ABI, SEPOLIA } from './contract';

type EthereumProvider = Eip1193Provider & {
	isMetaMask?: boolean;
	on?(event: string, handler: (...args: unknown[]) => void): void;
	removeListener?(event: string, handler: (...args: unknown[]) => void): void;
};

export type Wallet = {
	account: string | null;
	chainId: number | null;
	owner: string | null;
	name: string;
	connecting: boolean;
	switching: boolean;
	minting: boolean;
	error: string | null;
	lastTx: string | null;
	lastTokenId: string | null;
	hasProvider: boolean;
};

export const wallet = $state<Wallet>({
	account: null,
	chainId: null,
	owner: null,
	name: '42 Sabartho NFT',
	connecting: false,
	switching: false,
	minting: false,
	error: null,
	lastTx: null,
	lastTokenId: null,
	hasProvider: false
});

export function isConnected(w: Wallet) {
	return Boolean(w.account);
}

export function isSepolia(w: Wallet) {
	return w.chainId === SEPOLIA.chainId;
}

export function isOwner(w: Wallet) {
	return Boolean(w.account && w.owner && w.account.toLowerCase() === w.owner.toLowerCase());
}

function getEthereum(): EthereumProvider | undefined {
	if (!browser || !window.ethereum) return undefined;
	return window.ethereum as EthereumProvider;
}

function parseError(error: unknown): string {
	if (!error || typeof error !== 'object') return 'Une erreur est survenue.';

	const e = error as {
		code?: number | string;
		shortMessage?: string;
		reason?: string;
		message?: string;
	};

	if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
		return 'Action annulée dans MetaMask.';
	}

	const text = `${e.shortMessage ?? ''} ${e.reason ?? ''} ${e.message ?? ''}`;
	if (text.includes('OwnableUnauthorizedAccount') || text.includes('Ownable')) {
		return 'Seul le propriétaire du contrat peut minter.';
	}

	if (e.shortMessage) return e.shortMessage;
	if (e.reason) return e.reason;
	if (typeof e.message === 'string' && e.message.length < 180) return e.message;

	return 'Une erreur est survenue.';
}

function tokenIdFromReceipt(contract: Contract, receipt: TransactionReceipt | null) {
	if (!receipt) return null;

	for (const log of receipt.logs) {
		try {
			const parsed = contract.interface.parseLog({
				topics: log.topics as string[],
				data: log.data
			});
			if (parsed?.name === 'Transfer') {
				return parsed.args.tokenId.toString() as string;
			}
		} catch {
			// ignore logs from other contracts
		}
	}

	return null;
}

function onAccountsChanged(accounts: unknown) {
	const list = Array.isArray(accounts) ? (accounts as string[]) : [];
	wallet.account = list[0] ?? null;
	wallet.error = null;
	if (wallet.account && wallet.chainId === SEPOLIA.chainId) {
		void refreshContract();
	}
}

function onChainChanged(chainId: unknown) {
	wallet.chainId = typeof chainId === 'string' ? Number.parseInt(chainId, 16) : null;
	wallet.error = null;
	if (wallet.account && wallet.chainId === SEPOLIA.chainId) {
		void refreshContract();
	}
}

async function sync(provider: BrowserProvider) {
	const signer = await provider.getSigner();
	wallet.account = await signer.getAddress();
	wallet.chainId = Number((await provider.getNetwork()).chainId);
	if (wallet.chainId === SEPOLIA.chainId) {
		await refreshContract();
	}
}

function listen() {
	const eth = getEthereum();
	if (!eth?.on) return;
	eth.on('accountsChanged', onAccountsChanged);
	eth.on('chainChanged', onChainChanged);
}

export async function connect() {
	const eth = getEthereum();
	if (!eth) {
		wallet.error = 'MetaMask n’est pas installé.';
		return;
	}

	wallet.connecting = true;
	wallet.error = null;

	try {
		const provider = new BrowserProvider(eth);
		await provider.send('eth_requestAccounts', []);
		await sync(provider);
	} catch (error) {
		wallet.error = parseError(error);
	} finally {
		wallet.connecting = false;
	}
}

export function disconnect() {
	wallet.account = null;
	wallet.lastTx = null;
	wallet.lastTokenId = null;
	wallet.error = null;
}

export async function switchToSepolia() {
	const eth = getEthereum();
	if (!eth) {
		wallet.error = 'MetaMask n’est pas installé.';
		return;
	}

	wallet.switching = true;
	wallet.error = null;

	try {
		await eth.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: SEPOLIA.chainIdHex }]
		});
	} catch (error) {
		const e = error as { code?: number };
		if (e.code === 4902) {
			try {
				await eth.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: SEPOLIA.chainIdHex,
							chainName: SEPOLIA.name,
							nativeCurrency: SEPOLIA.nativeCurrency,
							rpcUrls: [SEPOLIA.rpcUrl],
							blockExplorerUrls: [SEPOLIA.explorer]
						}
					]
				});
			} catch (addError) {
				wallet.error = parseError(addError);
			}
		} else {
			wallet.error = parseError(error);
		}
	} finally {
		wallet.switching = false;
	}
}

export async function mint(to: string) {
	const eth = getEthereum();
	if (!eth) {
		wallet.error = 'MetaMask n’est pas installé.';
		return;
	}
	if (!isAddress(to)) {
		wallet.error = 'Adresse de destination invalide.';
		return;
	}
	if (!isSepolia(wallet)) {
		wallet.error = 'Passe sur le réseau Sepolia pour minter.';
		return;
	}

	wallet.minting = true;
	wallet.error = null;
	wallet.lastTx = null;
	wallet.lastTokenId = null;

	try {
		const provider = new BrowserProvider(eth);
		const signer = await provider.getSigner();
		const contract = new Contract(CONTRACT_ADDRESS, NFT_ABI, signer);
		const tx = await contract.safeMint(to);
		wallet.lastTx = tx.hash as string;
		const receipt = (await tx.wait()) as TransactionReceipt | null;
		wallet.lastTokenId = tokenIdFromReceipt(contract, receipt);
		await refreshContract();
	} catch (error) {
		wallet.error = parseError(error);
	} finally {
		wallet.minting = false;
	}
}

async function refreshContract() {
	const eth = getEthereum();
	if (!eth || wallet.chainId !== SEPOLIA.chainId) return;

	try {
		const provider = new BrowserProvider(eth);
		const contract = new Contract(CONTRACT_ADDRESS, NFT_ABI, provider);
		const [name, owner] = await Promise.all([contract.name(), contract.owner()]);
		wallet.name = name as string;
		wallet.owner = owner as string;
	} catch (error) {
		wallet.error = parseError(error);
	}
}

async function restore() {
	const eth = getEthereum();
	if (!eth) return;

	try {
		const provider = new BrowserProvider(eth);
		const accounts = await provider.send('eth_accounts', []);
		if (!accounts[0]) {
			wallet.chainId = Number((await provider.getNetwork()).chainId);
			return;
		}
		await sync(provider);
	} catch {
		// MetaMask locked or not ready yet
	}
}

if (browser) {
	wallet.hasProvider = Boolean(window.ethereum);
	void restore();
	listen();
}
