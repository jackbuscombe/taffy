function NftCardExtended({ id, imageUrl, nftName, projectName, price, creatorImage, creatorName }) {
	return (
		<div className="cursor-pointer hover:bg-gray-50 transition transform ease-in-out shadow-md text-sm rounded-md bg-white group">
			<img className=" w-full rounded-t-md group-hover:opacity-80 transition transform ease-in-out" src={imageUrl} />
			<div className="p-4 space-y-3">
				<div>
					<h4 className="font-semibold text-black">{nftName}</h4>
					<h5 className="text-gray-400 font-light">{projectName}</h5>
				</div>
				<p className="font-semibold text-gray-500 text-xs">{price}</p>
				<div className="flex items-center">
					<img src={creatorImage} alt={creatorName} className="rounded-full h-6 w-6 mr-2" />
					<p className="text-black font-semibold">{creatorName}</p>
				</div>
			</div>
		</div>
	);
}
export default NftCardExtended;
