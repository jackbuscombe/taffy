import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<MoralisProvider appId={process.env.NEXT_PUBLIC_APP_ID as string} serverUrl={process.env.NEXT_PUBLIC_SERVER_URL as string}>
			<Header />
			<Component {...pageProps} />
			<Footer />
		</MoralisProvider>
	);
}

export default MyApp;
