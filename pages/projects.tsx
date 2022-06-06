import FilterBar from "../components/FilterBar";
import HomeCard from "../components/HomeCard";
import NftCard from "../components/NftCard";

function Projects() {
	return (
		<div className="flex w-full justify-center bg-[#f3f6fc] py-12">
			<div className="w-4/5 grid grid-cols-5">
				<div className="hidden sm:block col-span-1">
					<FilterBar filterName="NFTs" />
				</div>

				{/* Main */}
				<div className="col-span-4">
					<h1 className="text-black text-4xl font-bold mb-8">Projects</h1>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
						<NftCard id={1} imageUrl="/nft1.png" nftName="NFT Name" projectName="Project Name" />
						<NftCard id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" />
						<NftCard id={1} imageUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" />
						<NftCard id={1} imageUrl="/nft4.png" nftName="NFT Name" projectName="Project Name" />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<HomeCard projectId={1} projectName="Project Name" projectImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={45} followers={41} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={false} />
						<HomeCard projectId={1} projectName="Project Name" projectImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={435} followers={122} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} />
						<HomeCard projectId={1} projectName="Project Name" projectImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={454} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} />

						<HomeCard projectId={1} projectName="Project Name" projectImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={451} followers={3} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={false} />
						<HomeCard projectId={1} projectName="Project Name" projectImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={4225} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} />
						<HomeCard projectId={1} projectName="Project Name" projectImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={55} followers={2} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} />
					</div>
				</div>
			</div>
		</div>
	);
}
export default Projects;
