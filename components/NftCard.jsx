function NftCard({ id, imageUrl, nftName, projectName }) {
	return (
		<div className="cursor-pointer hover:bg-gray-200 p-4 transition transform ease-in-out shadow-sm">
			<img src={imageUrl} className="mb-2" />
			<div>
				<h4 className="font-semibold text-black">{nftName}</h4>
				<h5 className="text-sm text-gray-400 font-light">{projectName}</h5>
			</div>
		</div>
	);
}
export default NftCard;
