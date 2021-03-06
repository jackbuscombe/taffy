import { PlusIcon } from "@heroicons/react/solid";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import NftCard from "../../components/NftCard";
import VotingCard from "../../components/VotingCard";
import { db } from "../../firebase";
import capitalizeFirstLetter from "../../hooks/capitalizeFirstLetter";
import secondsToDhms from "../../hooks/secondsToDhms";
import unixToDateTime from "../../hooks/unixToDateTime";
import { NftType, ProjectType, ProposalType } from "../../typings";

interface AdminPageType extends ProjectType {
	ended: boolean;
	secondsLeft: number;
	apy: number;
	odds: number;
	upcomingNfts: NftType[];
	releasedNfts: NftType[];
	proposals: ProposalType[];
}

function Admin({ id, projectName, projectTicker, projectImage, bannerImage, dropDates, endDate, ended, contributionsValue, target, secondsLeft, tokenId, tokenPrice, amountStaked, apy, odds, views, contributionsCount, followersCount, proposals, upcomingNfts, releasedNfts }: AdminPageType) {
	const router = useRouter();
	const [selected, setSelected] = useState<string>("nfts");
	const { account } = useMoralis();
	const [upcomingNftArray, setUpcomingNftArray] = useState<any>([]);
	const [releasedNftArray, setReleasedNftArray] = useState<any>([]);
	const [timeLeft, setTimeLeft] = useState<string>("");

	useEffect(() => {
		setTimeout(() => {
			setTimeLeft(secondsToDhms(endDate - Date.now() / 1000));
		}, 1000);
	}, [secondsLeft, timeLeft]);

	// useEffect(() => {
	// 	if (!account) {
	// 		return;
	// 	}

	// 	async function getNfts() {
	// 		// Get Project NFTS
	// 		let upcomingNfts: any = [];
	// 		let releasedNfts: any = [];
	// 		const nftQuery = query(collection(db, "nfts"), where("creatorAddress", "==", account));
	// 		const nftQuerySnapshot = await getDocs(nftQuery);
	// 		nftQuerySnapshot.forEach((doc) => {
	// 			if (doc.data().mintTimestamp > Date.now() / 1000) {
	// 				upcomingNfts.push({ id: doc.id, ...doc.data() });
	// 			} else if (doc.data().mintTimestamp < Date.now() / 1000) {
	// 				releasedNfts.push({ id: doc.id, ...doc.data() });
	// 			}
	// 		});

	// 		setUpcomingNftArray(upcomingNfts);
	// 		setReleasedNftArray(releasedNfts);
	// 	}

	// 	getNfts();
	// }, [account]);

	return (
		<main className="w-full flex flex-col items-center bg-gray-50">
			{/* <div className="flex flex-col w-full py-8 md:py-16 bg-auto text-white bg-[url('/admin_hero.png')] justify-center mb-8"></div> */}
			<img src={bannerImage} alt="" className="w-full" />

			<div className="w-3/4 space-y-12 py-8">
				<div className="flex flex-col md:grid grid-cols-8 gap-4 text-center bg-white p-4 rounded-lg shadow-md">
					<div className="col-span-2 flex flex-col text-center items-center sm:justify-center sm:flex-row justify-center sm:space-x-4">
						<img src={projectImage} alt="" className="h-16 w-16 rounded-full" />
						<div className="">
							<h1 onClick={() => router.push(`/project/${id}`)} className="text-lg font-semibold hover:underline cursor-pointer">
								{capitalizeFirstLetter(projectName)}
							</h1>
							<p className="text-gray-400 font-light">{projectTicker.toUpperCase()}</p>
						</div>
					</div>
					<div className="flex flex-col justify-center col-span-3 lg:col-span-2">
						<p className="text-lg font-semibold">{timeLeft}</p>
						<p className="text-sm text-gray-400">Next NFT Drop</p>
					</div>
					<div className="flex justify-center space-x-4 md:col-span-2">
						<div className="flex flex-col col-span-1 justify-center">
							<p className="text-lg font-semibold">{tokenPrice} ETH</p>
							<p className="text-sm text-gray-400">Token Price</p>
						</div>
						<div className="flex flex-col col-span-1 justify-center">
							<p className="text-lg font-semibold">{amountStaked}</p>
							<p className="text-sm text-gray-400">{projectTicker.toUpperCase()} Staked</p>
						</div>
					</div>
					<div className="hidden lg:flex flex-col lg:col-span-1 justify-center space-y-2">
						<button className="w-32 py-1 border-[1px] rounded-md border-[#21c275] text-[#21c275] font-semibold hover:bg-[#21c275] hover:text-white">Buy {projectTicker.toUpperCase()}</button>
						<button className="w-32 py-1 border-[1px] rounded-md border-[#5082fb] text-[#5082fb] font-semibold hover:bg-[#5082fb] hover:text-white">Stake {projectTicker.toUpperCase()}</button>
					</div>
				</div>

				<div className="flex flex-col-reverse sm:flex-row gap-2 justify-between pb-6 border-b-[1px] border-gray-200">
					<div className="flex flex-col sm:flex-row sm:space-x-4 items-start justify-center sm:items-center sm:justify-start">
						<p onClick={() => setSelected("nfts")} className={`font-semibold ${selected == "nfts" ? "text-[#5082fb] cursor-default" : "text-gray-500 cursor-pointer"}`}>
							NFTs
						</p>
						<p onClick={() => setSelected("votes")} className={`font-semibold ${selected == "votes" ? "text-[#5082fb] cursor-default" : "text-gray-500 cursor-pointer"}`}>
							Votes
						</p>
						<p onClick={() => setSelected("tokenomics")} className={`font-semibold ${selected == "tokenomics" ? "text-[#5082fb] cursor-default" : "text-gray-500 cursor-pointer"}`}>
							Tokenomics
						</p>
						<p onClick={() => setSelected("about")} className={`font-semibold ${selected == "about" ? "text-[#5082fb] cursor-default" : "text-gray-500 cursor-pointer"}`}>
							About
						</p>
					</div>
					<div className="flex mb-4 sm:mb-0 sm:justify-end space-x-6 items-center">
						<p className="text-red-500 font-semibold">ADMIN MODE</p>
						<button
							onClick={() =>
								router.push({
									pathname: "/mint",
									query: {
										id: id,
										projectName: projectName,
										projectImage: projectImage,
									},
								})
							}
							className="hidden sm:flex items-center bg-green-500 text-white px-4 py-2 rounded-sm font-semibold hover:bg-transparent border-[1px] hover:text-green-500 border-green-500 transition transform ease-in-out"
						>
							<PlusIcon className="h-3 w-3 mr-2" />
							Mint NFT
						</button>
					</div>
				</div>

				{selected === "nfts" ? (
					<div>
						<div
							onClick={() =>
								router.push({
									pathname: "/mint",
									query: {
										id: id,
										projectName: projectName,
										projectImage: projectImage,
									},
								})
							}
							className="w-1/3 flex flex-col md:flex-row text-center justify-center items-center space-x-2 bg-white rounded-sm p-12 shadow cursor-pointer hover:bg-gray-100 hover:shadow-lg mb-6"
						>
							<PlusIcon className="text-blue-500 h-10 w-10" />
							<p className="text-gray-700 text-lg font-semibold">Mint NFT</p>
						</div>
						<div className="mb-12">
							<h2 className="text-2xl text-gray-800 font-bold mb-5">NFTs queued for minting</h2>
							<div className="grid grid-cols-5 gap-4">
								{upcomingNfts.map((nft: NftType, i: number) => (
									<NftCard key={nft.id} id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} />
								))}
								{upcomingNfts?.length === 0 && <p className="col-span-5 text-center text-gray-500 italic font-light">No NFTs have been released yet.</p>}
							</div>
						</div>
						<div className="">
							<h2 className="text-2xl text-gray-800 font-bold mb-5">Already Released</h2>
							<div className="grid grid-cols-5 gap-4">
								{releasedNfts.map((nft: NftType, i: number) => (
									<NftCard key={nft.id} id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} />
								))}
								{releasedNfts?.length === 0 && <p className="col-span-5 text-center text-gray-500 italic font-light">No NFTs have been released yet.</p>}
							</div>
						</div>
					</div>
				) : selected === "votes" ? (
					<div className="flex flex-col w-full rounded-md">
						<div
							onClick={() =>
								router.push({
									pathname: "/create-proposal",
									query: {
										id: id,
										projectName: projectName,
										projectImage: projectImage,
										projectTicker: projectTicker,
									},
								})
							}
							className="w-1/3 flex flex-col md:flex-row text-center justify-center items-center space-x-2 bg-white rounded-sm p-12 shadow cursor-pointer hover:bg-gray-100 hover:shadow-lg mb-6"
						>
							<PlusIcon className="text-blue-500 h-10 w-10" />
							<p className="text-gray-700 text-lg font-semibold">Create Proposal</p>
						</div>
						<h2 className="text-2xl text-gray-800 font-bold mb-5">Active Proposals</h2>
						{proposals.map((proposal: any, i: number) => (
							<VotingCard key={proposal.id} proposalId={proposal.id} title={proposal.title} description={proposal.description} question={proposal.question} options={proposal.options} projectId={proposal.projectId} projectName={proposal.projectName} projectTicker={proposal.projectTicker} projectImage={proposal.projectImage} timeLeft={unixToDateTime(proposal.votingCloseTimestamp, "local")} />
						))}
					</div>
				) : selected === "tokenomics" ? (
					<div className="flex flex-col w-full bg-white rounded-md p-4 divide-y">
						<div className="">
							<h2 className="text-2xl text-gray-800 font-bold mb-5">Tokenomics</h2>
							<div className="flex flex-col md:flex-row space-x-4 py-4">
								<p className="font-semibold">End Date:</p>
								<p>{new Date(endDate * 1000).toUTCString()}</p>
							</div>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Amount Raised:</p>
							<p>{contributionsValue} ETH</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Target:</p>
							<p>{target} ETH</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Time Left:</p>
							<p>{unixToDateTime(endDate, "local")}</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Token Price:</p>
							<p>{tokenPrice} ETH</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Amount Staked:</p>
							<p>
								{amountStaked} {projectTicker.toUpperCase()}
							</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">APY:</p>
							<p>{apy}%</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Odds:</p>
							<p>{odds}</p>
						</div>
					</div>
				) : selected === "about" ? (
					<div className="flex flex-col w-full bg-white rounded-md p-4 divide-y">
						<div>
							<h2 className="text-2xl text-gray-800 font-bold mb-5">About</h2>
							<div className="flex flex-col md:flex-row space-x-4 py-4">
								<p className="font-semibold">Project Name:</p>
								<p>{capitalizeFirstLetter(projectName)}</p>
							</div>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Project Ticker:</p>
							<p>{projectTicker.toUpperCase()}</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Project Description:</p>
							<p>{projectName}</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Views:</p>
							<p>{views}</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Backers:</p>
							<p>{contributionsCount}</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Followers:</p>
							<p>{followersCount}</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col w-full bg-white rounded-md p-4 divide-y">
						<div>
							<h2 className="text-2xl text-gray-800 font-bold mb-5">About</h2>
							<div className="flex flex-col md:flex-row space-x-4 py-4">
								<p className="font-semibold">Project Name:</p>
								<p>{capitalizeFirstLetter(projectName)}</p>
							</div>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Project Ticker:</p>
							<p>{projectTicker.toUpperCase()}</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Project Description:</p>
							<p>{projectName}</p>
						</div>

						<div className="fflex flex-col md:flex-rowlex space-x-4 py-4">
							<p className="font-semibold">Views:</p>
							<p>{views}</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Backers:</p>
							<p>{contributionsCount}</p>
						</div>

						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">Followers:</p>
							<p>{followersCount}</p>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
export default Admin;

export async function getServerSideProps(context: any) {
	const id = context.params.id;

	// let projectDetails: ProjectType = {};
	const docSnap = await getDoc(doc(db, "projects", id));

	if (docSnap.exists()) {
		const apy = docSnap.data().apy;
		const amountStaked = docSnap.data().amountStaked;
		const bannerImage = docSnap.data().bannerImage;
		const contributions = docSnap.data().contributions;
		const contributionsCount = docSnap.data().contributionsCount;
		const contributionsValue = docSnap.data().contributionsValue;
		const createdTimestamp = docSnap.data().createdTimestamp;
		const creatorAddress = docSnap.data().creatorAddress;
		const creatorName = docSnap.data().creatorName;
		const discord = docSnap.data().discord;
		const dropDates = docSnap.data().dropDates;
		const endDate = docSnap.data().endDate;
		const followers = docSnap.data().followers;
		const followersCount = docSnap.data().followersCount;
		const frequency = docSnap.data().frequency;
		const linkedIn = docSnap.data().linkedIn;
		const projectDescription = docSnap.data().projectDescription;
		const projectImage = docSnap.data().projectImage;
		const projectName = docSnap.data().projectName;
		const projectTicker = docSnap.data().projectTicker;
		const tags = docSnap.data().tags;
		const target = docSnap.data().target;
		const telegram = docSnap.data().telegram;
		const tokenId = docSnap.data().tokenId;
		const tokenPrice = docSnap.data().tokenPrice;
		const twitter = docSnap.data().twitter;
		const views = docSnap.data().views;

		const odds = 9;
		const ended = Date.now() / 1000 > docSnap.data().endDate;
		const secondsLeft = secondsToDhms(endDate - Date.now() / 1000);

		let upcomingNfts: any = [];
		let releasedNfts: any = [];
		const nftQuery = query(collection(db, "nfts"), where("projectId", "==", id));
		const nftQuerySnapshot = await getDocs(nftQuery);
		nftQuerySnapshot.forEach((doc) => {
			if (doc.data().mintTimestamp > Date.now() / 1000) {
				upcomingNfts.push({ id: doc.id, ...doc.data() });
			} else if (doc.data().mintTimestamp < Date.now() / 1000) {
				releasedNfts.push({ id: doc.id, ...doc.data() });
			}
		});

		// Get Project Proposals
		let proposals: ProposalType[] = [];
		const proposalQuery = query(collection(db, "proposals"), where("projectId", "==", id));
		const proposalQuerySnapshot = await getDocs(proposalQuery);
		proposalQuerySnapshot.forEach((doc) => {
			proposals.push({
				id: doc.id,
				description: doc.data().description,
				options: doc.data().options,
				projectId: doc.data().projectId,
				projectImage: doc.data().projectImage,
				projectName: doc.data().projectName,
				projectTicker: doc.data().projectTicker,
				question: doc.data().question,
				title: doc.data().title,
				votingCloseTimestamp: doc.data().votingCloseTimestamp,
			});
		});

		return {
			props: {
				id,
				projectName,
				projectTicker,
				projectImage,
				bannerImage,
				dropDates,
				endDate,
				ended,
				contributionsValue,
				target,
				secondsLeft,
				tokenId,
				tokenPrice,
				amountStaked,
				views,
				contributionsCount,
				followersCount,
				apy,
				odds,
				upcomingNfts,
				releasedNfts,
				proposals,
			},
		};
	} else {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
}
