import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import ProjectCard from "../components/ProjectCard";
import { NftType, ProjectType } from "../typings";
import unixToDateTime from "../hooks/unixToDateTime";

const Home: NextPage = ({ projects, nfts }: any) => {
	const router = useRouter();
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
						<button onClick={() => router.push("/projects")} className="bg-[#5082fb] p-3 rounded-md flex-grow-0 text-center w-36">
							View all
						</button>
					</div>
				</div>

				{/* Home Grid Layer */}

				{/* Trending Projects */}
				<div className="w-full pb-12 flex flex-col">
					{/* Title */}
					<div className="w-3/4 self-center flex justify-between mb-8 flex-wrap">
						<h4 className="text-black text-2xl font-bold mb-2 sm:mb-0">Trending projects</h4>
						<div className="flex space-x-2">
							<button className="w-8 h-8 flex bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded justify-center items-center">
								<ChevronLeftIcon className="h-4 w-4" />
							</button>
							<button className="w-8 h-8 flex bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded justify-center items-center">
								<ChevronRightIcon className="h-4 w-4" />
							</button>
							<button className="w-20 h-8 bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded text-sm">View All</button>
						</div>
					</div>

					{/* Cards */}
					<div className="w-3/4 self-center grid grid-cols-1 lg:grid-cols-3 gap-4">
						{projects.map((project: ProjectType, i: number) => (
							<ProjectCard key={project.id} projectId={project.id} projectName={project.projectName} projectTicker={project.projectTicker} bannerImage={project.bannerImage} description={project.projectDescription} creatorName={project.creatorName} projectImage={project.projectImage} backers={project.contributionsCount} followers={project.followersCount} endDate={project.endDate} ethRaised={project.contributionsValue} ethTarget={project.target} amountStaked={project.amountStaked} nftDrop={false} />
						))}
					</div>
				</div>

				{/* Upcoming NFT Drops */}
				<div className="w-full pb-12 flex flex-col">
					{/* Title */}
					<div className="w-3/4 self-center flex justify-between mb-8 flex-wrap">
						<h4 className="text-black text-2xl font-bold mb-2 sm:mb-0">Upcoming NFT drops</h4>
						<div className="flex space-x-2">
							<button className="w-8 h-8 flex bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded justify-center items-center">
								<ChevronLeftIcon className="h-4 w-4" />
							</button>
							<button className="w-8 h-8 flex bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded justify-center items-center">
								<ChevronRightIcon className="h-4 w-4" />
							</button>
							<button className="w-20 h-8 bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded text-sm">View All</button>
						</div>
					</div>

					{/* Cards */}
					<div className="w-3/4 self-center grid grid-cols-1 lg:grid-cols-3 gap-4">
						{projects.map((project: ProjectType, i: number) => (
							<ProjectCard key={project.id} projectId={project.id} projectName={project.projectName} projectTicker={project.projectTicker} bannerImage={project.bannerImage} description={project.projectDescription} creatorName={project.creatorName} projectImage={project.projectImage} backers={project.contributionsCount} followers={project.followersCount} endDate={project.endDate} ethRaised={project.views} ethTarget={project.target} amountStaked={project.amountStaked} nftDrop={true} />
						))}
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;

export async function getServerSideProps() {
	let projects: ProjectType[] = [];
	const projectQuery = query(collection(db, "projects"), orderBy("createdTimestamp", "desc"), limit(3));
	const projectQuerySnapshot = await getDocs(projectQuery);
	projectQuerySnapshot.forEach((doc) => {
		projects.push({
			id: doc.id,
			apy: doc.data().apy,
			amountStaked: doc.data().amountStaked,
			bannerImage: doc.data().bannerImage,
			contributions: doc.data().contributions,
			contributionsCount: doc.data().contributionsCount,
			contributionsValue: doc.data().contributionsValue,
			createdTimestamp: doc.data().createdTimestamp,
			creatorAddress: doc.data().creatorAddress,
			creatorName: doc.data().creatorName,
			discord: doc.data().discord,
			dropDates: doc.data().dropDates,
			endDate: doc.data().endDate,
			followers: doc.data().followers,
			followersCount: doc.data().followersCount,
			frequency: doc.data().frequency,
			linkedIn: doc.data().linkedIn,
			projectDescription: doc.data().projectDescription,
			projectImage: doc.data().projectImage,
			projectName: doc.data().projectName,
			projectTicker: doc.data().projectTicker,
			tags: doc.data().tags,
			target: doc.data().target,
			telegram: doc.data().telegram,
			tokenId: doc.data().tokenId,
			tokenPrice: doc.data().tokenPrice,
			twitter: doc.data().twitter,
			views: doc.data().views,
		});
	});

	// const nftQuery = query(collection(db, "nfts"), orderBy("timestamp", "desc"), limit(3));
	// const nftResponse = await getDocs(nftQuery);

	// const nfts = nftResponse.docs.map((doc) => ({
	// 	id: doc.id,
	// 	...doc.data(),
	// }));

	return {
		props: {
			projects,
			// nfts,
		},
	};
}
