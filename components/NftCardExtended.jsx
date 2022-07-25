import { useRouter } from "next/router";
import capitalizeFirstLetter from "../hooks/capitalizeFirstLetter";

function NftCardExtended({ id, nftUrl, nftName, projectName, price, creatorImage, creatorName }) {
	const router = useRouter();

	return (
		<div onClick={() => router.push(`/nft/${id}`)} className="cursor-pointer hover:bg-gray-50 transition transform ease-in-out shadow-md text-sm rounded-md bg-white group">
			<img className=" w-full rounded-t-md group-hover:opacity-80 transition transform ease-in-out" src={nftUrl} />
			<div className="p-4 space-y-3">
				<div>
					<h4 className="font-semibold text-black">{capitalizeFirstLetter(nftName)}</h4>
					<h5 className="text-gray-400 font-light">{capitalizeFirstLetter(projectName)}</h5>
				</div>
				<p className="font-semibold text-gray-500 text-xs">{price} ETH</p>
				<div className="flex items-center">
					<img src={creatorImage} alt={creatorName} className="rounded-full h-6 w-6 mr-2 object-cover" />
					<p className="text-black font-semibold">{creatorName}</p>
				</div>
			</div>
		</div>
	);
}
export default NftCardExtended;
