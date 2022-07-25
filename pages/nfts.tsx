import FilterBar from "../components/FilterBar";
import NftCardExtended from "../components/NftCardExtended";
import PaginationBar from "../components/PaginationBar";
import { collection, getDocs, query, orderBy, doc, Timestamp, onSnapshot, limit, startAt } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { NftType } from "../typings";

type NftPageType = {
	nfts: NftType[];
};

function Nfts({ nfts }: NftPageType) {
	const [status, setStatus] = useState("all");
	const [categories, setCategories] = useState([]);
	const [sortBy, setSortBy] = useState("time");

	return (
		<div className="flex w-full justify-center bg-[#f3f6fc] py-12">
			<div className="w-4/5">
				<h1 className="text-black text-4xl font-bold mb-8">NFTs</h1>
				<div className="grid gap-5 grid-cols-5">
					<div className="sm:block col-span-5 md:col-span-1 sm:col-span-2">
						<FilterBar filterName="NFTs" status={status} setStatus={setStatus} categories={categories} setCategories={setCategories} sortBy={sortBy} setSortBy={setSortBy} />
					</div>

					{/* Main */}
					<div className="col-span-5 sm:col-span-3 md:col-span-4">
						<div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-12">
							{nfts?.map((nft: NftType, i: number) => (
								<NftCardExtended key={nft.id} id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} price={nft.price} creatorImage={nft.creatorImage} creatorName={nft.creatorName} />
							))}
						</div>

						<PaginationBar />
					</div>
				</div>
			</div>
		</div>
	);
}
export default Nfts;

export async function getServerSideProps() {
	let nfts: NftType[] = [];
	const nftQuery = query(collection(db, "nfts"), orderBy("createdTimestamp", "desc"), limit(20));
	const nftQuerySnapshot = await getDocs(nftQuery);
	nftQuerySnapshot.forEach((doc) => {
		nfts.push({
			id: doc.id,
			chain: doc.data().chain,
			contractAddress: doc.data().contractAddress,
			createdTimestamp: doc.data().createdTimestamp,
			creatorFees: doc.data().creatorFees,
			creatorAddress: doc.data().creatorAddress,
			creatorImage: doc.data().creatorImage,
			creatorName: doc.data().creatorName,
			description: doc.data().description,
			mintTimestamp: doc.data().mintTimestamp,
			name: doc.data().name,
			nftUrl: doc.data().nftUrl,
			price: doc.data().price,
			projectId: doc.data().projectId,
			projectName: doc.data().projectName,
			tokenId: doc.data().tokenId,
			tokenStandard: doc.data().tokenStandard,
			traits: doc.data().traits,
			views: doc.data().views,
		});
	});

	return {
		props: {
			nfts,
		},
	};
}
