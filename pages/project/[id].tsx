import { useEffect, useRef, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import NftCardExtended from "../../components/NftCardExtended";
import { useMoralis } from "react-moralis";
import { NftType, ProjectType, ProposalType } from "../../typings";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, doc, getDoc, getDocs, increment, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import BackProjectModal from "../../components/BackProjectModal";
import unixToDateTime from "../../hooks/unixToDateTime";
import capitalizeFirstLetter from "../../hooks/capitalizeFirstLetter";
import dateToUnix from "../../hooks/dateToUnix";
import secondsToDhms from "../../hooks/secondsToDhms";
import VotingCard from "../../components/VotingCard";
import StakeTokenModal from "../../components/StakeTokenModal";

interface ProjectPageType extends ProjectType {
	ended: boolean;
	secondsLeft: number;
	apy: number;
	odds: number;
	nfts: NftType[];
	// proposals: ProposalType[];
	// userTokenBalance: number;
}

function Project({ id, projectName, projectTicker, projectDescription, projectImage, bannerImage, dropDates, endDate, ended, creatorAddress, contributionsValue, target, secondsLeft, tokenId, tokenPrice, amountStaked, apy, odds, nfts, views, contributionsCount, followersCount }: ProjectPageType) {
	const router = useRouter();
	const [selected, setSelected] = useState<string>("nfts");
	const [isBackingModalOpen, setIsBackingModalOpen] = useState<boolean>(false);
	const [isStakingModalOpen, setIsStakingModalOpen] = useState<boolean>(false);
	const { authenticate, logout, isAuthenticated, isAuthenticating, account, user, enableWeb3 } = useMoralis();

	const [nextDrop, setNextDrop] = useState<string>("");
	const [localEndDate, setLocalEndDate] = useState<string>("");
	const [timeLeft, setTimeLeft] = useState<string>("");
	const [similarProjects, setSimilarProjects] = useState<ProjectType[]>([]);
	const [userTokenBalance, setUserTokenBalance] = useState<number>(0);
	const [proposals, setProposals] = useState<ProposalType[]>();

	const [upcomingNfts, setUpcomingNfts] = useState<NftType[]>();
	const [releasedNfts, setReleasedNfts] = useState<NftType[]>();

	useEffect(() => {
		setNextDrop(unixToDateTime(dropDates[0], "local)"));
		setLocalEndDate(unixToDateTime(endDate, "local"));
	}, [endDate]);

	useEffect(() => {
		setTimeout(() => {
			setTimeLeft(secondsToDhms(endDate - Date.now() / 1000));
		}, 1000);
	}, [secondsLeft, timeLeft]);

	const backProjectModalWrapper = useRef(null);
	useOutsideAlerter(backProjectModalWrapper);

	const stakeTokenModalWrapper = useRef(null);
	useOutsideAlerter(stakeTokenModalWrapper);

	useEffect(() => {
		enableWeb3;
	}, [account]);

	useEffect(() => {
		if (selected !== "similar") {
			return;
		}

		async function getSimilarProjects() {
			let projects: ProjectType[] = [];
			const projectQuery = query(collection(db, "projects"), where("id", "!=", id), orderBy("id", "desc"), limit(3));
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
			setSimilarProjects(projects);
		}
		getSimilarProjects();
	}, [selected]);

	function useOutsideAlerter(ref: any) {
		useEffect(() => {
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					if (ref === backProjectModalWrapper) {
						setIsBackingModalOpen(false);
					}
					if (ref === stakeTokenModalWrapper) {
						setIsStakingModalOpen(false);
					}
				}
			}
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	useEffect(() => {
		if (!nfts) {
			return;
		}
		let upcomingArray = [];
		let releasedArray = [];

		for (let i = 0; i < nfts.length; i++) {
			if (nfts[i].mintTimestamp > Date.now() / 1000) {
				upcomingArray.push(nfts[i]);
			}
			if (nfts[i].mintTimestamp < Date.now() / 1000) {
				releasedArray.push(nfts[i]);
			}
		}
		setUpcomingNfts(upcomingArray);
		setReleasedNfts(releasedArray);
	}, [nfts]);

	useEffect(() => {
		async function getUserTokenBalance() {
			if (typeof account !== "string") {
				return;
			}

			let bal = 0;

			const tokenBalanceSnap = await getDoc(doc(db, "tokens", tokenId, "holders", account));
			if (tokenBalanceSnap.exists()) {
				bal = tokenBalanceSnap.data().balance;
				setUserTokenBalance(bal);
			}
		}

		async function getUserProposalList() {
			// Get Project Proposals
			let proposalList: ProposalType[] = [];
			const proposalQuery = query(collection(db, "proposals"), where("projectId", "==", id));
			const proposalQuerySnapshot = await getDocs(proposalQuery);
			proposalQuerySnapshot.forEach((doc) => {
				proposalList.push({
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
			setProposals(proposalList);
		}

		getUserTokenBalance();
		getUserProposalList();
	}, [account]);

	return (
		<main className={`flex flex-col items-center w-full bg-blue-50 pb-8 ${isBackingModalOpen && ""}`}>
			<div style={{ backgroundImage: `url(${bannerImage})` }} className="flex z-10 flex-col w-full py-16 md:py-32 text-white bg-blend-darken justify-center bg-center bg-cover bg-no-repeat" />

			<div className="w-full bg-white flex flex-col items-center -mt-28">
				<div className="flex z-20 w-full justify-center items-center">
					<div className="w-2/3 flex flex-col sm:flex-row justify-between">
						<div className="flex space-x-4">
							<div className="bg-gray-100 h-[130px] w-[130px] rounded-full flex justify-center items-center overflow-hidden">
								<img src={projectImage} alt={projectName} className="h-[127px] w-[127px] rounded-full" />
							</div>
							<div className="flex flex-col justify-center sm:flex-row sm:items-center sm:space-x-2">
								<h1 className="text-white font-bold text-xl">{capitalizeFirstLetter(projectName)}</h1>
								<p className="text-gray-300">{projectTicker.toUpperCase()}</p>
							</div>
						</div>
						{creatorAddress === account && (
							<div className="flex items-center justify-self-end">
								<button onClick={() => router.push(`/admin/${id}`)} className="text-sm w-36 h-10 border-[1px] rounded-sm border-red-100 text-white font-semibold bg-red-500 hover:bg-red-600">
									Access Admin
								</button>
							</div>
						)}
					</div>
					{ended && (
						<div className="hidden sm:flex space-x-2">
							<button className="flex bg-blue-500 text-white font-semibold rounded-md px-4 py-1 hover:bg-blue-600 transition transform ease-in-out border-[1px] shadow-2xl">
								<img src={projectImage} alt="" className="h-6 w-6 rounded-full mr-2" />
								{amountStaked.toLocaleString()} ETH Staked
							</button>
							<button className="flex bg-green-500 text-white font-semibold rounded-md px-4 py-1 hover:bg-green-600 transition transform ease-in-out border-[1px] shadow-2xl">
								<img src={projectImage} alt="" className="h-6 w-6 rounded-full mr-2" />
								ODDS +{odds}
							</button>
						</div>
					)}
				</div>
				<div className="flex justify-center pt-3 pb-8 w-full bg-white">
					{ended ? (
						<div className="flex flex-col md:flex-row w-2/3 px-4 justify-between space-y-6 md:space-y-0">
							<div className="flex flex-col sm:flex-row justify-center sm:space-x-8 space-y-2 sm:space-y-0">
								<div>
									<p className="text-lg font-semibold">{unixToDateTime(endDate, "local")}</p>
									<p className="text-sm text-gray-400">Next NFT Drop</p>
								</div>
								<div className="sm:border-l-[1px] border-gray-100 sm:pl-4">
									<p className="text-lg font-semibold">${tokenPrice}</p>
									<p className="text-sm text-gray-400">Token price</p>
								</div>
								<div className="sm:border-l-[1px] border-gray-100 sm:pl-4">
									<p className="text-lg font-semibold">${amountStaked.toLocaleString()}</p>
									<p className="text-sm text-gray-400">$ Staked</p>
								</div>
								<div className="sm:border-l-[1px] border-gray-100 sm:pl-4">
									<p className="text-lg font-semibold">{apy}%</p>
									<p className="text-sm text-gray-400">est. APY</p>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row justify-center sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
								<button onClick={() => setIsStakingModalOpen(true)} className="text-sm px-6 py-2 border-[1px] rounded-sm border-blue-100 text-[#5082fb] font-semibold hover:bg-[#5082fb] hover:text-white transition transform ease-in-out">
									Stake {projectTicker.toUpperCase()}
								</button>
								<button className="text-sm px-6 py-2 border-[1px] rounded-sm border-blue-100 text-[#5082fb] font-semibold hover:bg-[#5082fb] hover:text-white transition transform ease-in-out">Get {projectTicker.toUpperCase()}</button>
							</div>
						</div>
					) : (
						<div className="flex flex-col sm:flex-row w-2/3 justify-between">
							<div className="w-full flex space-x-8">
								<div className="flex flex-col justify-center">
									<p className="text-lg font-semibold">
										{contributionsValue}ETH / {target}ETH
									</p>
									<p className="text-sm text-gray-400 mb-3">Raised</p>
									<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200 mb-6">
										<div style={{ width: `${contributionsValue > target ? "100%" : (contributionsValue / target) * 100}%` }} className={`h-2.5 rounded-full ${contributionsValue > target ? "bg-green-400" : "bg-blue-400"}`}></div>
									</div>
								</div>
								<div className="border-l-[1px] border-gray-100 pl-4 w-1/2">
									<p className="text-lg font-semibold">{timeLeft}</p>
									<p className="hidden sm:inline-block text-sm text-gray-400">All or nothing. This project will only be funded if it reaches its goal by {localEndDate}</p>
									<p className="inline-block sm:hidden text-sm text-gray-400">Left of raising period.</p>
								</div>
							</div>
							<div className="">
								{userTokenBalance > 0 && (
									<button onClick={() => setIsStakingModalOpen(true)} className="text-sm w-36 h-10 border-[1px] rounded-sm border-green-100 text-green-500 font-semibold hover:bg-green-500 hover:text-white mb-2">
										Stake {projectTicker.toUpperCase()}
									</button>
								)}
								<button onClick={() => setIsBackingModalOpen(true)} className="text-sm w-full sm:w-36 h-10 border-[1px] rounded-sm border-blue-100 text-[#5082fb] font-semibold hover:bg-[#5082fb] hover:text-white">
									Back Project
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-col items-center w-2/3 mb-4 space-y-4 border-b-[1px] border-b-gray-300">
				<div className="flex flex-col sm:flex-row self-start sm:space-x-4 space-y-2 sm:space-y-1 py-4">
					<div onClick={() => setSelected("nfts")} className={`px-4 py-2 ${selected == "nfts" ? "bg-[#5082fb] cursor-default" : "bg-transparent cursor-pointer"} border-[1px] border-gray-300 rounded-sm`}>
						<p className={`${selected == "nfts" ? "text-white font-bold cursor-default" : "text-gray-500 font-semibold"}`}>NFTs</p>
					</div>
					<div onClick={() => setSelected("votes")} className={`px-4 py-2 ${selected == "votes" ? "bg-[#5082fb] cursor-default" : "bg-transparent cursor-pointer"} border-[1px] border-gray-300 rounded-sm`}>
						<p className={`${selected == "votes" ? "text-white font-bold" : "text-gray-500 font-semibold"}`}>Votes</p>
					</div>
					<div onClick={() => setSelected("tokenomics")} className={`px-4 py-2 ${selected == "tokenomics" ? "bg-[#5082fb] cursor-default" : "bg-transparent cursor-pointer"} border-[1px] border-gray-300 rounded-sm`}>
						<p className={`${selected == "tokenomics" ? "text-white font-bold" : "text-gray-500 font-semibold"}`}>Tokenomics</p>
					</div>
					<div onClick={() => setSelected("about")} className={`px-4 py-2 ${selected == "about" ? "bg-[#5082fb] cursor-default" : "bg-transparent cursor-pointer"} border-[1px] border-gray-300 rounded-sm`}>
						<p className={`${selected == "about" ? "text-white font-bold" : "text-gray-500 font-semibold"}`}>About</p>
					</div>
					<div onClick={() => setSelected("similar")} className={`px-4 py-2 ${selected == "similar" ? "bg-[#5082fb] cursor-default" : "bg-transparent cursor-pointer"} border-[1px] border-gray-300 rounded-sm`}>
						<p className={`${selected == "similar" ? "text-white font-bold" : "text-gray-500 font-semibold"}`}>Similar Projects</p>
					</div>
				</div>
			</div>

			{/* Cards */}
			{selected == "nfts" ? (
				<div className="flex space-x-6 w-2/3 justify-between my-4">
					<div className="space-y-14">
						<div>
							<div className="w-2/3 mb-6">
								<h2 className="text-2xl text-gray-800 font-bold mb-5">Prize for next round</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
								{upcomingNfts?.map((nft, i) => (
									<NftCardExtended key={nft.id} id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} price={nft.price} creatorImage={nft.creatorImage} creatorName={nft.creatorName} />
								))}
								{upcomingNfts?.length === 0 && <p className="col-span-4 text-center text-gray-500 italic font-light">There are no upcoming NFTs</p>}
								{/* {nfts
									.filter((nft) => nft.mintTimestamp > Date.now() / 1000)
									.map((nft, i) => (
										<NftCardExtended key={nft.id} id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} price={nft.price} creatorImage={nft.creatorImage} creatorName={nft.creatorName} />
									))} */}
							</div>
						</div>
						<div className="">
							<div className="mb-6">
								<h2 className="text-2xl text-gray-800 font-bold mb-5">Already Released</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
								{releasedNfts?.map((nft, i) => (
									<NftCardExtended key={nft.id} id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} price={nft.price} creatorImage={nft.creatorImage} creatorName={nft.creatorName} />
								))}
								{releasedNfts?.length === 0 && <p className="col-span-4 text-center text-gray-500 italic font-light">No NFTs have been released yet.</p>}
								{/* {nfts
									.filter((nft) => nft.mintTimestamp < Date.now() / 1000)
									.map((nft, i) => (
										<NftCardExtended key={nft.id} id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} price={nft.price} creatorImage={nft.creatorImage} creatorName={nft.creatorName} />
									))} */}
							</div>
						</div>
					</div>
				</div>
			) : selected == "votes" ? (
				<div className="flex flex-col w-2/3 rounded-md p-4 divide-y">
					<h2 className="text-2xl text-gray-800 font-bold mb-5">Active Proposals</h2>
					{proposals?.map((proposal: any, i: number) => (
						<VotingCard key={proposal.id} proposalId={proposal.id} title={proposal.title} description={proposal.description} question={proposal.question} options={proposal.options} projectId={proposal.projectId} projectName={proposal.projectName} projectTicker={proposal.projectTicker} projectImage={proposal.projectImage} timeLeft={unixToDateTime(proposal.votingCloseTimestamp, "local")} />
					))}
				</div>
			) : selected == "tokenomics" ? (
				<div className="flex flex-col w-2/3 bg-white rounded-md p-4 divide-y">
					<div className="">
						<h2 className="text-2xl text-gray-800 font-bold mb-5">Tokenomics</h2>
						<div className="flex flex-col md:flex-row space-x-4 py-4">
							<p className="font-semibold">End Date:</p>
							<p>{new Date(endDate * 1000).toUTCString()}</p>
						</div>
					</div>

					<div className="flex flex-col md:flex-row space-x-4 py-4">
						<p className="font-semibold">Amount Raised:</p>
						<p>{contributionsValue}</p>
					</div>

					<div className="flex flex-col md:flex-row space-x-4 py-4">
						<p className="font-semibold">Target:</p>
						<p>{target} ETH</p>
					</div>

					<div className="flex flex-col md:flex-row space-x-4 py-4">
						<p className="font-semibold">Time Left:</p>
						<p>{timeLeft}</p>
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
			) : selected == "about" ? (
				<div className="flex flex-col w-2/3 bg-white rounded-md p-4 divide-y">
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
						<p>{projectDescription}</p>
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
			) : selected == "similar" ? (
				<div className="flex space-x-6 w-2/3 justify-between my-4">
					{similarProjects.map((project, i) => (
						<ProjectCard key={project.id} projectId={project.id} projectName={project.projectName} projectTicker={project.projectTicker} bannerImage={project.bannerImage} description={project.projectDescription} creatorName={project.creatorName} projectImage={project.projectImage} backers={project.contributionsCount} followers={project.followersCount} endDate={project.endDate} ethRaised={project.contributionsValue} ethTarget={project.target} amountStaked={project.amountStaked} nftDrop={true} />
					))}
					{/* <ProjectCard projectId={1} projectName="Project Name" bannerImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={endDate} ethRaised={contributionsValue} ethTarget={target} nftDrop={true} />
					<ProjectCard projectId={1} projectName="Project Name" bannerImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={endDate} ethRaised={contributionsValue} ethTarget={target} nftDrop={true} />
					<ProjectCard projectId={1} projectName="Project Name" bannerImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={endDate} ethRaised={contributionsValue} ethTarget={target} nftDrop={true} /> */}
				</div>
			) : (
				<div className="flex space-x-6 w-2/3 justify-between my-4">
					<ProjectCard projectId={1} projectName="Project Name" projectTicker={"TKN"} bannerImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={endDate} ethRaised={contributionsValue} ethTarget={target} amountStaked={5} nftDrop={true} />
					<ProjectCard projectId={1} projectName="Project Name" projectTicker={"TKN"} bannerImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={endDate} ethRaised={contributionsValue} ethTarget={target} amountStaked={5} nftDrop={true} />
					<ProjectCard projectId={1} projectName="Project Name" projectTicker={"TKN"} bannerImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={endDate} ethRaised={contributionsValue} ethTarget={target} amountStaked={5} nftDrop={true} />
				</div>
			)}
			{isBackingModalOpen && (
				<div ref={backProjectModalWrapper}>
					<BackProjectModal id={id} setIsBackingModalOpen={setIsBackingModalOpen} endTime={new Date(endDate * 1000).toUTCString()} projectName={projectName} tokenId={tokenId} tokenPrice={tokenPrice} projectTicker={projectTicker} />
				</div>
			)}
			{isStakingModalOpen && (
				<div ref={stakeTokenModalWrapper}>
					<StakeTokenModal tokenId={tokenId} userTokenBalance={userTokenBalance} setIsStakingModalOpen={setIsStakingModalOpen} endTime={new Date(endDate * 1000).toUTCString()} projectName={projectName} tokenPrice={tokenPrice} tokenTicker={projectTicker} />
				</div>
			)}
		</main>
	);
}
export default Project;

export async function getServerSideProps({ params }: any) {
	const id = params.id;

	const docRef = doc(db, "projects", id);
	const docSnap = await getDoc(docRef);

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
		// const nextDrop = docSnap.data().dropDates[0].toString();

		// Find Next Drop
		// let currentDay = new Date();
		// let upcomingDrop;
		// for (let i = 0; i < docSnap.data().dropDates.length; i++) {
		// 	if (currentDay < docSnap.data().dropDates[i]) {
		// 		upcomingDrop = docSnap.data().dropDates[i];
		// 	}
		// }

		await updateDoc(doc(db, "projects", id), {
			views: increment(1),
		});

		// Get Project NFTS
		let nfts: Object[] = [];
		const nftQuery = query(collection(db, "nfts"), where("projectId", "==", id));
		const nftQuerySnapshot = await getDocs(nftQuery);
		nftQuerySnapshot.forEach((doc) => {
			nfts.push({ id: doc.id, ...doc.data() });
		});

		return {
			props: {
				id,
				projectName,
				projectTicker,
				projectDescription,
				projectImage,
				bannerImage,
				dropDates,
				endDate,
				ended,
				creatorAddress,
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
				nfts,
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
