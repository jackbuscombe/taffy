import { CheckIcon, ChevronDownIcon, FilterIcon } from "@heroicons/react/outline";
import { useState } from "react";
import PaginationBar from "../components/PaginationBar";
import VotingCard from "../components/VotingCard";

function Voting() {
	const [sortExpanded, setSortExpanded] = useState<boolean>(false);
	const [sortedBy, setSortedBy] = useState<string>("popular");

	return (
		<div className="w-full flex flex-col items-center bg-blue-50 py-8">
			<div className="w-3/4 flex flex-col space-y-6 mb-8">
				<div className="flex justify-between">
					<h1 className="text-2xl font-bold">Voting</h1>
					<div className="flex items-center space-x-2">
						<p className="text-sm">Sort by:</p>
						<div className="relative inline-block group justify-between">
							<button className={`flex justify-between w-40 p-1 border-[1px] border-gray-300 rounded-sm font-semibold items-center`}>
								<FilterIcon className="h-6 w-6 text-blue-500" />
								<div className="flex w-full justify-between items-center px-2">
									<p className="text-xs">{sortedBy == "popular" ? "Most Popular" : sortedBy == "closing" ? "Closing soonest" : sortedBy == "apy" ? "Highest APY" : sortedBy == "staked" ? "Amount staked" : ""}</p>
								</div>
								<ChevronDownIcon className="h-6 w-6 text-gray-300" />
							</button>
							<div className="hidden absolute group-hover:block z-10 bg-white divide-y divide-gray-100 rounded-sm shadow w-44">
								<div onClick={() => setSortedBy("popular")} className="flex justify-between items-center py-1 cursor-pointer px-4 text-gray-700 hover:bg-gray-100">
									<p className="block py-2 text-sm text-gray-700 hover:bg-gray-100">Most Popular</p>
									{sortedBy == "popular" && <CheckIcon className="h-4 w-4 text-green-500" />}
								</div>
								<div onClick={() => setSortedBy("closing")} className="flex justify-between items-center py-1 cursor-pointer px-4 text-gray-700 hover:bg-gray-100">
									<p className="block py-2 text-sm text-gray-700 hover:bg-gray-100">Closing soonest</p>
									{sortedBy == "closing" && <CheckIcon className="h-4 w-4 text-green-500" />}
								</div>
								<div onClick={() => setSortedBy("apy")} className="flex justify-between items-center py-1 cursor-pointer px-4 text-gray-700 hover:bg-gray-100">
									<p className="block py-2 text-sm">Highest APY</p>
									{sortedBy == "apy" && <CheckIcon className="h-4 w-4 text-green-500" />}
								</div>
								<div onClick={() => setSortedBy("staked")} className="flex justify-between items-center py-1 cursor-pointer px-4 text-gray-700 hover:bg-gray-100">
									<p className="block py-2 text-sm text-gray-700 hover:bg-gray-100">Amount staked</p>
									{sortedBy == "staked" && <CheckIcon className="h-4 w-4 text-green-500" />}
								</div>
							</div>
						</div>
					</div>
				</div>

				<VotingCard projectId={1} projectName="Project Name" projectTicker="SLN" timeLeft="05:07:23:12" amountStaked="3,934,432" apy="14" />
				<VotingCard projectId={1} projectName="Project Name" projectTicker="SLN" timeLeft="05:07:23:12" amountStaked="3,934,432" apy="14" />
				<VotingCard projectId={1} projectName="Project Name" projectTicker="SLN" timeLeft="05:07:23:12" amountStaked="3,934,432" apy="14" />
			</div>

			<div className="w-3/4">
				<PaginationBar />
			</div>
		</div>
	);
}
export default Voting;
