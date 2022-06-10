import Image from "next/image";
import { useState } from "react";
import EarningsTable from "../components/EarningsTable";
import PaginationBar from "../components/PaginationBar";

function Rewards() {
	const [earning, setEarning] = useState<boolean>(false);

	return (
		<div className="w-full flex flex-col items-center bg-gray-100">
			<div className="flex flex-col w-full py-16 md:py-24 bg-auto text-white bg-[url('/rewards_hero.png')] justify-center mb-12" />

			<div className="-m-48 w-2/3 flex flex-col mb-48">
				<h1 className="text-3xl font-bold mb-8 font-sans">Rewards</h1>

				<div className="bg-white grid grid-cols-2 gap-16 rounded-sm shadow-md p-8 mb-12">
					<div className="flex flex-col col-span-1 space-y-8">
						<div className="flex justify-center space-x-8">
							<div>
								<p className="text-lg font-semibold">$0.43</p>
								<p className="text-sm text-gray-400">Latest Price (USD)</p>
							</div>
							<div className="border-l-[1px] border-gray-100 pl-4">
								<p className="text-lg font-semibold">$3,934,432</p>
								<p className="text-sm text-gray-400">Staked (USD)</p>
							</div>
							<div className="border-l-[1px] border-gray-100 pl-4">
								<p className="text-lg font-semibold">14%</p>
								<p className="text-sm text-gray-400">Est APY</p>
							</div>
						</div>
						<div className="flex justify-center items-center space-x-2">
							<button className="flex-1 text-sm py-2 border-[1px] rounded-sm border-blue-100 text-[#5082fb] font-semibold hover:bg-[#5082fb] hover:text-white">Buy Taffy</button>
							<button className="flex-1 text-sm py-2 border-[1px] rounded-sm border-blue-100 text-[#5082fb] font-semibold hover:bg-[#5082fb] hover:text-white">Stake Taffy/ETH</button>
						</div>
					</div>
					<div className="col-span-1 flex flex-col space-y-8">
						<div className="flex space-x-8">
							<div className="border-l-[1px] border-gray-100 pl-4">
								<p className="text-lg font-semibold">$245</p>
								<p className="text-sm text-gray-400">My Stake (USD)</p>
							</div>
							<div className="border-l-[1px] border-gray-100 pl-4">
								<p className="text-lg font-semibold">$1.05</p>
								<p className="text-sm text-gray-400">Latest Rewards</p>
							</div>
						</div>
						<button className="flex-1 py-2 rounded-sm text-sm font-semibold bg-[#21c275] text-white hover:bg-white hover:text-[#21c275] hover:border-[1px] hover:border-[#21c275]">Claim</button>
					</div>
				</div>

				<h2 className="text-xl font-bold mb-5">All projects using Taffy</h2>
				<div className="flex justify-between mb-8">
					<div className="flex space-x-3">
						<button onClick={() => setEarning(false)} className={`${earning ? "bg-gray-100" : "bg-blue-500 text-white"} px-4 py-2 rounded-sm border-[1px] border-gray-300 text-sm font-semibold hover:bg-blue-600 hover:text-white`}>
							Rewards
						</button>
						<button onClick={() => setEarning(true)} className={`${!earning ? "bg-gray-100" : "bg-blue-500 text-white"} px-4 py-2 rounded-sm border-[1px] border-gray-300 text-sm font-semibold hover:bg-blue-600 hover:text-white`}>
							Earning
						</button>
					</div>

					<div className="flex">
						<div className="flex items-center bg-gray-50 rounded-sm px-2 shadow-sm border-[1px] text-sm">
							<input type="text" className="flex-1 outline-none bg-transparent" placeholder="Search" />
						</div>
					</div>
				</div>
				<EarningsTable />
				<div className="mt-8">
					<PaginationBar />
				</div>
			</div>
		</div>
	);
}
export default Rewards;
