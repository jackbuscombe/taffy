import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import { SessionProvider } from "next-auth/react";

// import { WagmiConfig, createClient, defaultChains, configureChains } from "wagmi";

// import { alchemyProvider } from "wagmi/providers/alchemy";
// import { publicProvider } from "wagmi/providers/public";

// import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
// import { InjectedConnector } from "wagmi/connectors/injected";
// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

// const alchemyId = process.env.ALCHEMY_ID;

// // Configure chains & providers with the Alchemy provider.
// // Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
// const { chains, provider, webSocketProvider } = configureChains(defaultChains, [alchemyProvider({ alchemyId }), publicProvider()]);

// // Set up client
// const client = createClient({
// 	autoConnect: true,
// 	connectors: [
// 		new MetaMaskConnector({ chains }),
// 		new CoinbaseWalletConnector({
// 			chains,
// 			options: {
// 				appName: "wagmi",
// 			},
// 		}),
// 		new WalletConnectConnector({
// 			chains,
// 			options: {
// 				qrcode: true,
// 			},
// 		}),
// 		new InjectedConnector({
// 			chains,
// 			options: {
// 				name: "Injected",
// 				shimDisconnect: true,
// 			},
// 		}),
// 	],
// 	provider,
// 	webSocketProvider,
// });

function MyApp({ Component, pageProps }: AppProps) {
	return (
		// <WagmiConfig client={client}>
		<MoralisProvider appId={process.env.NEXT_PUBLIC_APP_ID as string} serverUrl={process.env.NEXT_PUBLIC_SERVER_URL as string}>
			<Header />
			<Component {...pageProps} />
			<Footer />
		</MoralisProvider>
		// </WagmiConfig>
	);
}

export default MyApp;
