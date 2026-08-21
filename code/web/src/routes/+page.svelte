<script lang="ts">
	import { isAddress } from 'ethers';
	import {
		wallet,
		connect,
		disconnect,
		mint,
		switchToSepolia,
		isConnected,
		isSepolia,
		isOwner
	} from '$lib/wallet.svelte';
	import { explorerTx, shortenAddress } from '$lib/contract';

	let recipient = $state('');

	const canMint = $derived(
		isConnected(wallet) &&
			isSepolia(wallet) &&
			isOwner(wallet) &&
			!wallet.minting &&
			isAddress(recipient)
	);

	$effect(() => {
		if (wallet.account) recipient = wallet.account;
	});

	function onMint(event: SubmitEvent) {
		event.preventDefault();
		void mint(recipient);
	}
</script>

<div class="bg-safe-bg text-safe-text min-h-screen font-sans">
	<header class="mx-auto flex max-w-lg items-center justify-between px-4 py-5">
		<h1 class="text-lg font-semibold">{wallet.name}</h1>

		{#if isConnected(wallet) && wallet.account}
			<button
				type="button"
				class="bg-safe-surface text-safe-mute hover:text-safe-text cursor-pointer rounded-full px-3 py-1.5 font-mono text-xs"
				onclick={() => disconnect()}
			>
				{shortenAddress(wallet.account)}
			</button>
		{:else}
			<button
				type="button"
				class="bg-safe-green text-safe-bg cursor-pointer rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60"
				disabled={wallet.connecting}
				onclick={() => connect()}
			>
				{wallet.connecting ? 'Connexion…' : 'Connecter MetaMask'}
			</button>
		{/if}
	</header>

	<main class="mx-auto max-w-lg px-4 pb-16">
		<div class="bg-safe-card rounded-2xl p-5">
			{#if !wallet.hasProvider}
				<p class="text-safe-mute text-sm">
					Installe
					<a class="text-safe-green" href="https://metamask.io/download/" target="_blank" rel="noreferrer"
						>MetaMask</a
					>
					puis recharge la page.
				</p>
			{:else if !isConnected(wallet)}
				<p class="text-safe-mute text-sm">Connecte ton wallet pour minter. Seul le owner du contrat peut le faire.</p>
			{:else if !isSepolia(wallet)}
				<p class="text-safe-mute text-sm">Passe sur Sepolia pour minter.</p>
				<button
					type="button"
					class="bg-safe-green text-safe-bg mt-4 w-full cursor-pointer rounded-full py-2.5 text-sm font-semibold disabled:opacity-60"
					disabled={wallet.switching}
					onclick={() => switchToSepolia()}
				>
					{wallet.switching ? 'Changement…' : 'Passer sur Sepolia'}
				</button>
			{:else}
				<form class="space-y-4" onsubmit={onMint}>
					<label class="text-safe-mute block text-sm">
						Destinataire
						<input
							class="border-safe-line bg-safe-surface mt-2 w-full rounded-xl border px-4 py-3 font-mono text-sm text-white outline-none focus:border-safe-green"
							bind:value={recipient}
							placeholder="0x…"
							spellcheck="false"
						/>
					</label>

					{#if !isOwner(wallet)}
						<p class="text-safe-mute text-sm">Ce wallet n'est pas le owner — le mint sera refusé.</p>
					{/if}

					<button
						type="submit"
						class="bg-safe-green text-safe-bg w-full cursor-pointer rounded-full py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
						disabled={!canMint}
					>
						{wallet.minting ? 'Mint en cours…' : 'Minter'}
					</button>
				</form>
			{/if}
		</div>

		{#if wallet.error}
			<p class="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
				{wallet.error}
			</p>
		{/if}

		{#if wallet.lastTx}
			<p class="text-safe-mute mt-4 text-sm">
				{#if wallet.lastTokenId}Token #{wallet.lastTokenId} minté.{:else}Transaction confirmée.{/if}
				<a class="text-safe-green" href={explorerTx(wallet.lastTx)} target="_blank" rel="noreferrer">
					Etherscan
				</a>
			</p>
		{/if}
	</main>
</div>
