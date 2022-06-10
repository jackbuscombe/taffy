import { ChevronDownIcon } from "@heroicons/react/outline";
import { useState } from "react";

function VotingCard({ projectId, projectName, projectTicker, timeLeft, amountStaked, apy }) {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleExpand = () => {
		if (!isExpanded) {
			setIsExpanded(true);
		} else {
			setIsExpanded(false);
		}
	};

	return (
		<div className="bg-white rounded-md p-8 shadow-md">
			<div className="flex justify-between pb-4">
				<div className="flex items-center space-x-4">
					<img src="/face-1.png" alt="profile" className="h-16 w-16 rounded-full" />
					<div>
						<div className="flex items-center space-x-2">
							<h2 className="text-gray-700 font-bold text-lg">{projectName}</h2>
							<p className="text-gray-400 text-light">{projectTicker}</p>
						</div>
						<p className="text-green-500 text-xs cursor-pointer hover:underline">Participate</p>
					</div>
				</div>

				<div className="flex space-x-8 py-4">
					<div className="border-l-2 border-gray-100 pl-4">
						<p className="text-lg font-semibold">{timeLeft}</p>
						<p className="text-sm text-gray-400">Vote Closes</p>
					</div>
					<div className="border-l-2 border-gray-100 pl-4">
						<p className="text-lg font-semibold">${amountStaked}</p>
						<p className="text-sm text-gray-400">Staked (USD)</p>
					</div>
					<div className="border-l-2 border-gray-100 pl-4">
						<p className="text-lg font-semibold">{apy}%</p>
						<p className="text-sm text-gray-400">Est APY</p>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<button className="w-24 py-1 border-[1px] rounded-sm border-[#21c275] text-[#21c275] font-semibold hover:bg-[#21c275] hover:text-white">Buy TKN</button>
					<button className="w-24 py-1 border-[1px] rounded-sm border-[#5082fb] text-[#5082fb] font-semibold hover:bg-[#5082fb] hover:text-white">Stake TKN</button>
					<button onClick={handleExpand} className="ml-2 p-1 border-[1px] rounded-sm border-gray-400 hover:bg-gray-100 hover:text-white flex justify-center items-center">
						<ChevronDownIcon className={`h-6 w-6 text-gray-400 ${isExpanded && "rotate-180"} transition transform ease-in-out`} />
					</button>
				</div>
			</div>

			{isExpanded && (
				<form className="border-t-[1px] border-t-gray-100 grid grid-cols-4 gap-12 mb-4 pt-6">
					<div className="col-span-1">
						<h4 className="font-semibold">Choose an answer</h4>
						<p className="text-xs text-gray-400">Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form</p>
					</div>

					<div className="col-span-3 space-y-2">
						<div className="flex flex-1 items-center p-4 space-x-4 text-sm border-[1px] rounded-sm border-gray-200 cursor-pointer hover:bg-blue-50">
							<input type="radio" className="cursor-pointer" />
							<label className="cursor-pointer">All</label>
						</div>
						<div className="flex flex-1 items-center p-4 space-x-4 text-sm border-[1px] rounded-sm border-gray-200 cursor-pointer hover:bg-blue-50">
							<input type="radio" className="cursor-pointer" />
							<label className="cursor-pointer">Upcoming prize games</label>
						</div>
						<div className="flex flex-1 items-center p-4 space-x-4 text-sm border-[1px] rounded-sm border-gray-200 cursor-pointer hover:bg-blue-50">
							<input type="radio" className="cursor-pointer" />
							<label className="cursor-pointer">Already released</label>
						</div>
					</div>
				</form>
			)}
		</div>
	);
}
export default VotingCard;
