import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";
import HomeRow from "../components/HomeRow";

const Home: NextPage = () => {
	return (
		<div className="bg-[#f3f6fc]">
			<Head>
				<title>Taffy</title>
				<meta name="description" content="Taffy" />
				<meta property="og:image" content="/home_banner.png" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="">
				{/* Banner */}
				<div className="flex flex-col w-full py-8 md:py-16 bg-auto text-white bg-[url('/home_banner.png')] justify-center mb-12">
					<div className="flex flex-col space-y-6 md:w-3/4 self-center">
						<h2 className="text-5xl font-semibold leading-snug md:w-1/2">Achieve your financial goals sooner</h2>
						<h3>Start trading 500+ listed cryptos today</h3>
						<button className="bg-[#5082fb] p-3 rounded-md flex-grow-0 text-center w-36">View all</button>
					</div>
				</div>

				{/* Home Grid Layer */}
				<HomeRow sectionTitle="Trending projects" nftDrop={false} />
				<HomeRow sectionTitle="Upcoming NFT drops" nftDrop={true} />
			</main>
		</div>
	);
};

export default Home;
