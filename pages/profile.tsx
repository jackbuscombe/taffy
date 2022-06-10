import { useEffect, useState } from "react";
import HomeCard from "../components/HomeCard";
import HomeRow from "../components/HomeRow";
import NftCardExtended from "../components/NftCardExtended";
import { useMoralis } from "react-moralis";

function Profile() {
	const [backedToggle, setBackedToggle] = useState(true);
	const { authenticate, logout, isAuthenticated, isAuthenticating, account, user, enableWeb3 } = useMoralis();

	useEffect(() => {
		enableWeb3;
	}, [user]);

	return (
		<main className="flex flex-col items-center w-full">
			<div className="flex flex-col w-full py-16 md:py-32 bg-auto text-white bg-blend-darken bg-[url('/profile_hero.png')] justify-center mb-12" />

			<div className="w-2/3 flex justify-between items-center -m-40">
				<div className="flex space-x-4">
					<div className="bg-gray-100 h-[130px] w-[130px] rounded-full flex justify-center items-center">
						<img src="/profile_image.png" alt="" className="h-[127px] w-[127px]" />
					</div>
					<div className="flex flex-col justify-center space-y-2">
						<h1 className="text-white font-bold text-xl">James Mi</h1>
						<p className="text-white">{account}</p>
					</div>
				</div>
				<button className="bg-transparent text-white font-semibold rounded-sm border-[1px] border-white px-4 py-1">Edit profile</button>
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
					{/* <HomeRow sectionTitle="Trending projects" nftDrop={false} /> */}
					<HomeCard projectId={1} projectName="Project Name" projectImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={45} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} />
					<HomeCard projectId={1} projectName="Project Name" projectImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={45} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} />
					<HomeCard projectId={1} projectName="Project Name" projectImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={45} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} />
				</div>
			) : (
				<div className="flex w-2/3 justify-between my-4">
					<NftCardExtended id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" price="4.534 ETH" creatorImage="/face-1.png" creatorName="Jason Manx" />
					<NftCardExtended id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" price="4.534 ETH" creatorImage="/face-1.png" creatorName="Jason Manx" />
					<NftCardExtended id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" price="4.534 ETH" creatorImage="/face-1.png" creatorName="Jason Manx" />
				</div>
			)}
		</main>
	);
}
export default Profile;
