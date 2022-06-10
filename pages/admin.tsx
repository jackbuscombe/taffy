import { PlusIcon } from "@heroicons/react/solid";
import { useState } from "react";
import NftCard from "../components/NftCard";

function Admin() {
	const [selected, setSelected] = useState<string>("nfts");
	return (
		<main className="w-full flex flex-col items-center bg-gray-50">
			{/* <div className="flex flex-col w-full py-8 md:py-16 bg-auto text-white bg-[url('/admin_hero.png')] justify-center mb-8"></div> */}
			<img src="/admin_hero.png" alt="" className="w-full" />

			<div className="w-3/4 space-y-12 py-8">
				<div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-lg shadow-md">
					<div className="col-span-2 flex justify-center items-center space-x-4">
						<img src="/face-1.png" alt="" className="col-span-1 h-16 w-16 rounded-full" />
						<div className="col-span-1">
							<h1 className="text-lg font-semibold">Project Name</h1>
							<p className="text-gray-400 font-light">TKN</p>
						</div>
					</div>
					<div className="flex flex-col col-span-1 justify-center">
						<p className="text-lg font-semibold">05:27:23:17</p>
						<p className="text-sm text-gray-400">Next NFT Drop</p>
					</div>
					<div className="flex flex-col col-span-1 justify-center">
						<p className="text-lg font-semibold">$0.023</p>
						<p className="text-sm text-gray-400">Token Price</p>
					</div>
					<div className="flex flex-col col-span-1 justify-center">
						<p className="text-lg font-semibold">$230,834</p>
						<p className="text-sm text-gray-400">$ Staked</p>
					</div>
					<div className="flex flex-col justify-center space-y-2">
						<button className="w-32 py-1 border-[1px] rounded-md border-[#21c275] text-[#21c275] font-semibold hover:bg-[#21c275] hover:text-white">Buy TKN</button>
						<button className="w-32 py-1 border-[1px] rounded-md border-[#5082fb] text-[#5082fb] font-semibold hover:bg-[#5082fb] hover:text-white">Stake TKN</button>
					</div>
				</div>

				<div className="flex justify-between pb-6 border-b-[1px] border-gray-200">
					<div className="flex space-x-4">
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
					<p className="text-red-700 font-bold">ADMIN MODE</p>
				</div>

				<div className="w-1/3 flex justify-center items-center space-x-2 bg-white rounded-sm p-12 shadow cursor-pointer hover:bg-gray-100 hover:shadow-lg">
					<PlusIcon className="text-blue-500 h-10 w-10" />
					<p className="text-gray-700 text-lg font-semibold">Mint NFT</p>
				</div>

				{selected == "nfts" && (
					<div>
						<div className="mb-12">
							<h2 className="text-2xl text-gray-800 font-bold mb-5">NFTs queued for minting</h2>
							<div className="grid grid-cols-5 gap-4">
								<NftCard id={1} imageUrl="/nft1.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft4.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" />
							</div>
						</div>
						<div className="">
							<h2 className="text-2xl text-gray-800 font-bold mb-5">Already Released</h2>
							<div className="grid grid-cols-5 gap-4">
								<NftCard id={1} imageUrl="/nft1.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft4.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" />
								<NftCard id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" />
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
export default Admin;
