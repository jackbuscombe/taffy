function HomeCard({ projectId, projectName, projectImage, description, creatorName, creatorImage, backers, followers, timeLeft, ethRaised, ethTarget, nftDrop }) {
	return (
		<div className="rounded-lg cursor-pointer bg-white hover:bg-gray-50 shadow-lg text-sm">
			<img src={projectImage} alt="" className="h-26 w-full" />
			<div className="w-full p-5">
				<div className="flex space-x-2 items-center mb-4">
					<img src={creatorImage} alt="Creator" className="h-8 w-8 rounded-full" />
					<div>
						<p className="text-black font-bold">{projectName}</p>
						<p className="text-gray-500 text-sm">{creatorName}</p>
					</div>
				</div>
				<p className="text-gray-700 mb-4">{description}</p>
				<div className="flex space-x-4 mb-4">
					<p className="text-gray-700 text-sm">
						<span className="text-blue-500 font-semibold">{backers} </span> Backers
					</p>
					<p className="text-gray-700">
						<span className="text-blue-500 font-semibold">{followers} </span> Followers
					</p>
				</div>
				{!nftDrop && (
					<div>
						<div className="flex justify-between mb-2">
							<p>{timeLeft}</p>
							<p>
								{ethRaised} ETH / {ethTarget} Raised
							</p>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200 mb-6">
							<div className="bg-blue-500 h-2.5 rounded-full w-36"></div>
						</div>
					</div>
				)}
				{nftDrop && (
					<div className="grid grid-cols-2 mb-6 w-3/4">
						<div className="border-r-[1px]">
							<p className="font-semibold">{timeLeft}</p>
							<p className="text-gray-400 text-xs">Next NFT Drop</p>
						</div>
						<div className="pl-4">
							<p className="font-semibold">$235,986</p>
							<p className="text-gray-400 text-xs">Staked (USD)</p>
						</div>
					</div>
				)}
				<button className="w-full bg-transparent hover:bg-[#5082fb] text-blue-500 font-semibold hover:text-white py-2 px-4 border border-[#5082fb] hover:border-transparent rounded shadow-md">{nftDrop ? "Stake TKN" : "Back Project"}</button>
				{nftDrop && <button className="w-full mt-2 bg-transparent hover:bg-[#4fc681] text-green-500 font-semibold hover:text-white py-2 px-4 border border-[#4fc681] hover:border-transparent rounded shadow-md">Get TKN</button>}
			</div>
		</div>
	);
}
export default HomeCard;
