import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import HomeCard from "./HomeCard";

function HomeRow({ sectionTitle, nftDrop }) {
	return (
		<div className="w-full pb-12 flex flex-col">
			{/* Title */}
			<div className="w-3/4 self-center flex justify-between mb-8">
				<h4 className="text-black text-2xl font-bold">{sectionTitle}</h4>
				<div className="flex space-x-2">
					<button className="w-8 h-8 flex bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded justify-center items-center">
						<ChevronLeftIcon className="h-4 w-4" />
					</button>
					<button className="w-8 h-8 flex bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded justify-center items-center">
						<ChevronRightIcon className="h-4 w-4" />
					</button>
					<button className="w-20 h-8 bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white border border-gray-400 hover:border-transparent rounded text-sm">View All</button>
				</div>
			</div>

			{/* Cards */}
			<div className="w-3/4 self-center grid grid-cols-1 lg:grid-cols-3 gap-4">
				<HomeCard projectId={1} projectName="Project Name" projectImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={45} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={nftDrop} />
				<HomeCard projectId={1} projectName="Project Name" projectImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={45} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={nftDrop} />
				<HomeCard projectId={1} projectName="Project Name" projectImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={45} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={nftDrop} />
			</div>
		</div>
	);
}
export default HomeRow;
