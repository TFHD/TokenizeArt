interface EthereumProvider {
	request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
	on?(event: string, handler: (...args: unknown[]) => void): void;
	removeListener?(event: string, handler: (...args: unknown[]) => void): void;
	isMetaMask?: boolean;
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		ethereum?: EthereumProvider;
	}
}

export {};
