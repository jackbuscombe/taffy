function FilterBar({ filterName }) {
	return (
		<div>
			<h3 className="font-semibold mb-8">Filter {filterName}</h3>
			<form className="flex flex-col space-y-4 mb-12">
				<div className="flex items-center mr-4">
					<input id="green-radio" type="radio" value="all" className="w-4 h-4 mr-2 cursor-pointer" />
					<label className="ml-2 text-sm text-[#4e5765] cursor-pointer">All</label>
				</div>
				<div className="flex items-center mr-4">
					<input id="green-radio" type="radio" value="upcoming" className="w-4 h-4 mr-2 cursor-pointer" />
					<label className="ml-2 text-sm text-[#4e5765] cursor-pointer">Upcoming prize games</label>
				</div>
				<div className="flex items-center mr-4">
					<input id="green-radio" type="radio" value="released" className="w-4 h-4 mr-2 cursor-pointer" />
					<label className="ml-2 text-sm text-[#4e5765] cursor-pointer">Already released</label>
				</div>
			</form>

			<form action="" className="flex flex-col space-y-6">
				<h3 className="font-semibold mb-8">More Filters</h3>
				<p className="ml-2 text-sm text-[#4e5765] hover:underline cursor-pointer">Time Remaining</p>

				<div className="flex flex-col space-y-2">
					<p className="ml-2 text-sm text-[#4e5765] hover:underline cursor-pointer">Category</p>
					<p className="ml-2 text-sm text-[#4e5765] hover:underline cursor-pointer">Number of backers</p>
					<p className="ml-2 text-sm text-[#4e5765] hover:underline cursor-pointer">Amount raised</p>
				</div>

				<p className="ml-2 text-sm text-[#4e5765] hover:underline cursor-pointer">Followers</p>
			</form>
		</div>
	);
}
export default FilterBar;
