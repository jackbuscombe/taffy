import { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import NftCardExtended from "../../components/NftCardExtended";
import { useMoralis } from "react-moralis";
import { collection, getDoc, getDocs, limit, orderBy, query, doc, where } from "firebase/firestore";
import { db } from "../../firebase";
import { NftType, UserType } from "../../typings";
import capitalizeFirstLetter from "../../hooks/capitalizeFirstLetter";
import { useRouter } from "next/router";

export type ProfilePageType = {
	userDetails: UserType;
	contributions: ContributionType[];
	nftArray: NftType[];
};

export type ContributionType = {
	id: string;
	amount: number;
	contributionTimestamp: number;
	projectId: string;
	projectName: string;
	projectImage: string;
	projectBannerImage: string;
	projectDescription: string;
	projectTicker: string;
	creatorName: string;
	backers: number;
	followers: number;
	endDate: number;
	ethRaise: number;
	ethTarget: number;
	amountStaked: number;
	nftDrop: boolean;
};

function Profile({ userDetails, contributions, nftArray }: ProfilePageType) {
	const [backedToggle, setBackedToggle] = useState(true);
	const { authenticate, logout, isAuthenticated, isAuthenticating, account, user, enableWeb3 } = useMoralis();
	const router = useRouter();

	useEffect(() => {
		enableWeb3;
	}, [user]);

	return (
		<main className="flex flex-col items-center w-full">
			{/* <div className="flex flex-col w-full py-32 bg-cover text-white bg-blend-darken bg-[url('/profile_hero.png')] justify-center mb-12"> */}

			<div className="bg-gradient-to-b from-slate-600 to-black h-32 w-full relative flex flex-col py-8 sm:py-32 text-white bg-blend-darken justify-center mb-12">
				<img src="/profile_hero.png" alt="" className="w-full h-full object-cover absolute mix-blend-overlay" />
			</div>
			{/* <div className="flex flex-col w-full py-32 bg-cover text-white bg-blend-darken bg-[url('/profile_hero.png')] justify-center mb-12" /> */}

			<div className="w-2/3 flex flex-col sm:flex-row text-center sm:text-left justify-between items-center -m-40 z-10">
				<div className="w-full flex flex-col items-center sm:flex-row space-x-4">
					<div className="bg-gray-100 h-[60px] w-[60px] sm:h-[130px] sm:w-[130px] rounded-full flex justify-center items-center mb-4 sm:mb-0">
						<img src={userDetails.profileImage} alt="" className="h-[58px] w-[58px] sm:h-[127px] sm:w-[127px] object-cover rounded-full" />
					</div>
					<div className="bg-gray-100 w-3/4 sm:bg-transparent p-2 sm:p-0 rounded-md shadow flex flex-col justify-center space-y-2">
						<h1 className="text-black sm:text-white font-bold text-xl">{`${capitalizeFirstLetter(userDetails.firstName)} ${capitalizeFirstLetter(userDetails.lastName) ?? ""}`}</h1>
						<p className="text-black sm:text-white truncate">{account}</p>
					</div>
				</div>
				{userDetails.id == account && (
					<button onClick={() => router.push("/settings")} className="bg-transparent text-white font-semibold rounded-sm border-[1px] border-white px-4 py-1 hover:bg-black transition transform ease-in-out">
						Edit profile
					</button>
				)}
			</div>

			<div className="flex flex-col items-center w-2/3 mb-4 mt-44 space-y-4 border-b-[1px] border-b-gray-300">
				<div className="flex self-start space-x-4 py-4">
					<div className={`px-4 py-2 ${backedToggle ? "bg-[#5082fb]" : "bg-transparent"}`}>
						<p onClick={() => setBackedToggle(true)} className={`${backedToggle ? "text-white font-bold cursor-default" : "text-gray-500 font-semibold cursor-pointer"}`}>
							Projects Backed
						</p>
					</div>
					<div className={`px-4 py-2 ${!backedToggle ? "bg-[#5082fb]" : "bg-transparent"}`}>
						<p onClick={() => setBackedToggle(false)} className={`${!backedToggle ? "text-white font-bold cursor-default" : "text-gray-500 font-semibold cursor-pointer"}`}>
							NFTs
						</p>
					</div>
				</div>
			</div>

			{/* Cards */}
			{backedToggle ? (
				<div className="flex space-x-6 w-2/3 justify-between my-4">
					{contributions.map((contribution: ContributionType, i: number) => (
						<ProjectCard projectId={contribution.projectId} projectName={contribution.projectName} projectTicker={contribution.projectTicker} bannerImage={contribution.projectBannerImage} description={contribution.projectDescription} creatorName={contribution.creatorName} projectImage={contribution.projectImage} backers={contribution.backers} followers={contribution.followers} endDate={contribution.endDate} ethRaised={contribution.ethRaise} ethTarget={contribution.ethTarget} amountStaked={contribution.amountStaked} nftDrop={contribution.nftDrop} />
					))}
					{/* <ProjectCard projectId={1} projectName="Project Name" bannerImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={1658355127} ethRaised={7.5} ethTarget={10} nftDrop={true} />
					<ProjectCard projectId={1} projectName="Project Name" bannerImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={1658355127} ethRaised={7.5} ethTarget={10} nftDrop={true} />
					<ProjectCard projectId={1} projectName="Project Name" bannerImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={355} endDate={1658355127} ethRaised={7.5} ethTarget={10} nftDrop={true} /> */}
				</div>
			) : (
				<div className="flex w-2/3 justify-evenly my-4">
					{nftArray.map((nft: NftType, i: number) => (
						<NftCardExtended id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} price={nft.price} creatorImage={nft.creatorImage} creatorName={nft.creatorName} />
					))}
					{/* <NftCardExtended id={1} nftUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" price="4.534 ETH" creatorImage="/face-1.png" creatorName="Jason Manx" />
					<NftCardExtended id={1} nftUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" price="4.534 ETH" creatorImage="/face-1.png" creatorName="Jason Manx" /> */}
				</div>
			)}
		</main>
	);
}
export default Profile;

export async function getServerSideProps(context: any) {
	const id = context.params.id;
	let contributions: ContributionType[] = [];
	let nftArray: NftType[] = [];

	const userRef = doc(db, "users", id);
	const userSnap = await getDoc(userRef);
	let userDetails: UserType = {
		id: context.params.id,
		bio: "",
		firstName: "",
		lastName: "",
		profileImage: "",
		userCreatedTimestamp: 0,
	};

	if (userSnap.exists()) {
		userDetails = {
			id: context.params.id,
			bio: userSnap.data().bio,
			firstName: userSnap.data().firstName,
			lastName: userSnap.data().lastName,
			profileImage: userSnap.data().profileImage,
			userCreatedTimestamp: userSnap.data().userCreatedTimestamp,
		};
	} else {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	// Get Projects Backed
	let projectId: string = "";
	let projectName = "";
	let projectImage = "";
	let projectBannerImage = "";
	let projectDescription = "";
	let projectTicker = "";
	let creatorName = "";
	let backers = 1;
	let followers = 1;
	let endDate = 1;
	let ethRaise = 1;
	let ethTarget = 1;
	let amountStaked = 0;
	let nftDrop = true;

	const contributionQuery = query(collection(db, "users", id, "contributions"), orderBy("contributionTimestamp", "desc"), limit(3));
	const contributionQuerySnapshot = await getDocs(contributionQuery);

	for (const contribution of contributionQuerySnapshot.docs) {
		// Get Project Details
		const docSnap = await getDoc(doc(db, "projects", contribution.data().projectId));

		if (docSnap.exists()) {
			projectId = docSnap.id;
			amountStaked = docSnap.data().amountStaked;
			projectName = docSnap.data().projectName;
			projectImage = docSnap.data().projectImage;
			projectBannerImage = docSnap.data().bannerImage;
			projectDescription = docSnap.data().projectDescription;
			projectTicker = docSnap.data().projectTicker;
			creatorName = docSnap.data().creatorName;
			backers = docSnap.data().contributionsCount;
			followers = docSnap.data().followersCount;
			endDate = docSnap.data().endDate;
			ethRaise = docSnap.data().contributionsValue;
			ethTarget = docSnap.data().target;
			nftDrop = true;
		} else {
			console.log("No such document!");
		}
		contributions.push({
			id: contribution.id,
			amount: contribution.data().amount,
			contributionTimestamp: contribution.data().contributionTimestamp,
			projectId: contribution.data().projectId,
			projectName,
			projectImage,
			projectBannerImage,
			projectDescription,
			projectTicker,
			creatorName,
			backers,
			followers,
			endDate,
			ethRaise,
			ethTarget,
			amountStaked,
			nftDrop,
		});
	}

	const nftQuery = query(collection(db, "nfts"), where("creatorAddress", "==", id));

	const nftQuerySnapshot = await getDocs(nftQuery);
	nftQuerySnapshot.forEach((nft) => {
		nftArray.push({
			id: nft.id,
			chain: nft.data().chain,
			contractAddress: nft.data().contractAddress,
			createdTimestamp: nft.data().createdTimestamp,
			creatorAddress: nft.data().creatorAddress,
			creatorFees: nft.data().creatorFees,
			creatorImage: nft.data().creatorImage,
			creatorName: nft.data().creatorName,
			description: nft.data().description,
			mintTimestamp: nft.data().mintTimestamp,
			name: nft.data().name,
			nftUrl: nft.data().nftUrl,
			price: nft.data().price,
			projectId: nft.data().projectId,
			projectName: nft.data().projectName,
			tokenId: nft.data().tokenId,
			tokenStandard: nft.data().tokenStandard,
			traits: nft.data().traits,
			views: nft.data().views,
		});
	});
	console.log(nftArray);

	return {
		props: {
			userDetails,
			contributions,
			nftArray,
		},
	};
}
