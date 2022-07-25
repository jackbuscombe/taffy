import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import capitalizeFirstLetter from "../hooks/capitalizeFirstLetter";
import unixToDateTime from "../hooks/unixToDateTime";

function ProjectCard({ projectId, projectName, projectTicker, projectImage, description, creatorName, bannerImage, backers, followers, endDate, ethRaised, ethTarget, amountStaked, nftDrop }) {
	const router = useRouter();
	const [date, setDate] = useState();

	useEffect(() => {
		setDate(unixToDateTime(endDate, "local"));
	}, [endDate]);

	return (
		<div onClick={() => router.push(`/project/${projectId}`)} className="rounded-lg cursor-pointer bg-white hover:bg-gray-50 shadow-lg text-sm w-full">
			<img src={bannerImage} alt={`${projectName} Banner Image`} className="h-[80px] w-full object-cover object-center" />
			<div className="w-full p-5">
				<div className="flex space-x-2 items-center mb-4">
					<img src={projectImage} alt={`${projectName} Project Image`} className="h-8 w-8 rounded-full shadow-md" />
					<div>
						<p className="text-black font-bold">{capitalizeFirstLetter(projectName)}</p>
						<p className="text-gray-500 text-sm">{capitalizeFirstLetter(creatorName)}</p>
					</div>
				</div>
				<p className="text-gray-700 mb-4">{description}</p>
				<div className="flex mb-4 flex-wrap">
					<p className="text-gray-700 text-sm mr-4">
						<span className="text-blue-500 font-semibold">{backers} </span> {backers == 1 ? "Backer" : "Backers"}
					</p>
					<p className="text-gray-700">
						<span className="text-blue-500 font-semibold">{followers} </span> {followers == 1 ? "Follower" : "Followers"}
					</p>
				</div>
				{!nftDrop && (
					<div>
						<div className="flex justify-between mb-2 flex-wrap">
							<p className="mb-2">{date}</p>
							<p>
								{ethRaised} ETH / {ethTarget} Raised
							</p>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200 mb-6">
							<div style={{ width: `${ethRaised > ethTarget ? "100%" : (ethRaised / ethTarget) * 100}%` }} className={`h-2.5 rounded-full ${ethRaised > ethTarget ? "bg-green-400" : "bg-blue-400"}`}></div>
						</div>
					</div>
				)}
				{nftDrop && (
					<div className="flex flex-col sm:flex-row grid-cols-2 mb-6 w-3/4">
						<div className="sm:border-r-[1px] sm:pr-4">
							<p className="font-semibold">{date}</p>
							<p className="text-gray-400 text-xs">Next NFT Drop</p>
						</div>
						<div className="sm:pl-4">
							<p className="font-semibold">${amountStaked}</p>
							<p className="text-gray-400 text-xs">Staked (USD)</p>
						</div>
					</div>
				)}
				<button className="w-full bg-transparent hover:bg-[#5082fb] text-blue-500 font-semibold hover:text-white py-2 px-4 border border-[#5082fb] hover:border-transparent rounded shadow-md transition ease-in-out">{nftDrop ? `Stake ${projectTicker.toUpperCase()}` : "Back Project"}</button>
				{nftDrop && <button className="w-full mt-2 bg-transparent hover:bg-[#4fc681] text-green-500 font-semibold hover:text-white py-2 px-4 border border-[#4fc681] hover:border-transparent rounded shadow-md">Get {projectTicker.toUpperCase()}</button>}
			</div>
		</div>
	);
}
export default ProjectCard;
