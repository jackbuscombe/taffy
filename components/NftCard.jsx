import { useRouter } from "next/router";
import capitalizeFirstLetter from "../hooks/capitalizeFirstLetter";

function NftCard({ id, nftUrl, nftName, projectName }) {
	const router = useRouter();

	return (
		<div onClick={() => router.push(`/nft/${id}`)} className="cursor-pointer hover:bg-gray-200 p-4 transition transform ease-in-out shadow-sm">
			<img src={nftUrl} className="mb-2" />
			<div>
				<h4 className="font-semibold text-black">{capitalizeFirstLetter(nftName)}</h4>
				<h5 className="text-sm text-gray-400 font-light">{capitalizeFirstLetter(projectName)}</h5>
			</div>
		</div>
	);
}
export default NftCard;
