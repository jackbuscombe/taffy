import FilterBar from "../components/FilterBar";
import NftCardExtended from "../components/NftCardExtended";
import PaginationBar from "../components/PaginationBar";

function Nfts() {
	return (
		<div className="flex w-full justify-center bg-[#f3f6fc] py-12">
			<div className="w-4/5 grid grid-cols-5">
				<div className="hidden sm:block col-span-1">
					<FilterBar filterName="NFT's" />
				</div>

				{/* Main */}
				<div className="col-span-4">
					<h1 className="text-black text-4xl font-bold mb-8">NFTs</h1>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
						<NftCardExtended id={1} imageUrl="/nft1.png" nftName="NFT Name" projectName="Project Name" price="4.534 ETH" creatorImage="/face-1.png" creatorName="Jason Manx" />
						<NftCardExtended id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" price="0.2 ETH" creatorImage="/face-1.png" creatorName="Andrew Kitchen" />
						<NftCardExtended id={1} imageUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" price="2.79 ETH" creatorImage="/face-1.png" creatorName="Heidi Yo" />
						<NftCardExtended id={1} imageUrl="/nft4.png" nftName="NFT Name" projectName="Project Name" price="15 ETH" creatorImage="/face-1.png" creatorName="Glenn Bart" />

						<NftCardExtended id={1} imageUrl="/nft1.png" nftName="NFT Name" projectName="Project Name" price="4.534 ETH" creatorImage="/face-1.png" creatorName="Jason Manx" />
						<NftCardExtended id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" price="0.2 ETH" creatorImage="/face-1.png" creatorName="Andrew Kitchen" />
						<NftCardExtended id={1} imageUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" price="2.79 ETH" creatorImage="/face-1.png" creatorName="Heidi Yo" />
						<NftCardExtended id={1} imageUrl="/nft4.png" nftName="NFT Name" projectName="Project Name" price="15 ETH" creatorImage="/face-1.png" creatorName="Glenn Bart" />

						<NftCardExtended id={1} imageUrl="/nft1.png" nftName="NFT Name" projectName="Project Name" price="4.534 ETH" creatorImage="/face-1.png" creatorName="Jason Manx" />
						<NftCardExtended id={1} imageUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" price="0.2 ETH" creatorImage="/face-1.png" creatorName="Andrew Kitchen" />
						<NftCardExtended id={1} imageUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" price="2.79 ETH" creatorImage="/face-1.png" creatorName="Heidi Yo" />
						<NftCardExtended id={1} imageUrl="/nft4.png" nftName="NFT Name" projectName="Project Name" price="15 ETH" creatorImage="/face-1.png" creatorName="Glenn Bart" />
					</div>

					<PaginationBar />
				</div>
			</div>
		</div>
	);
}
export default Nfts;
