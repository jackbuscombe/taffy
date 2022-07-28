import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import capitalizeFirstLetter from "../hooks/capitalizeFirstLetter";

const DUMMY_SEARCH = [
	{
		id: 1,
		projectName: "Hello Bingo",
		image: "/nft1.png",
	},
	{
		id: 2,
		projectName: "Hello James",
		image: "/nft2.png",
	},
];

function SearchDropdown({ searchInput, setIsSearchDropdownOpen }) {
	const router = useRouter();

	const [sortBy, setSortBy] = useState("all");
	const [searchResults, setSearchResults] = useState("");

	useEffect(() => {
		setSearchResults(null);

		async function queryDatabase() {
			let updatedResults = [];

			if (sortBy === "all" || sortBy === "projects") {
				const projectSearchRef = collection(db, "projects");
				const projectQ = query(projectSearchRef, where("projectName", ">=", searchInput.toLowerCase()), where("projectName", "<=", searchInput.toLowerCase() + "\uf8ff"));
				const projectQuerySnapshot = await getDocs(projectQ);
				projectQuerySnapshot.forEach((doc) => {
					updatedResults.push({
						id: doc.id,
						type: "project",
						...doc.data(),
					});
				});
			}

			if (sortBy === "all" || sortBy === "nfts") {
				const nftSearchRef = collection(db, "nfts");
				const nftQ = query(nftSearchRef, where("name", ">=", searchInput.toLowerCase()), where("name", "<=", searchInput.toLowerCase() + "\uf8ff"));
				const nftQuerySnapshot = await getDocs(nftQ);
				nftQuerySnapshot.forEach((doc) => {
					updatedResults.push({
						id: doc.id,
						type: "nft",
						...doc.data(),
					});
				});
			}
			console.log(updatedResults);

			setSearchResults(updatedResults);
		}

		queryDatabase();

		console.log("Search is updated", searchInput);
	}, [searchInput, sortBy]);

	return (
		<div className="absolute bg-white rounded-sm text-sm p-4 mt-2 shadow-lg">
			<div className="flex items-center space-x-3 mb-4 text-gray-500">
				<p>Sort By:</p>
				<button onClick={() => setSortBy("all")} className={`${sortBy != "all" ? "hover:bg-gray-100" : "bg-blue-500 text-white"} px-4 py-2 rounded-sm border-[1px] border-gray-300 text-sm font-semibold`}>
					All
				</button>
				<button onClick={() => setSortBy("projects")} className={`${sortBy != "projects" ? "hover:bg-gray-100" : "bg-blue-500 text-white"} px-4 py-2 rounded-sm border-[1px] border-gray-300 text-sm font-semibold`}>
					Projects
				</button>
				<button onClick={() => setSortBy("nfts")} className={`${sortBy != "nfts" ? "hover:bg-gray-100" : "bg-blue-500 text-white"} px-4 py-2 rounded-sm border-[1px] border-gray-300 text-sm font-semibold`}>
					NFTs
				</button>
			</div>

			<div className="text-black font-semibold border-t">
				{searchResults ? (
					searchResults.length > 0 ? (
						searchResults.map((result, i) => (
							<div
								key={i}
								onClick={() => {
									if (result.type === "project") {
										router.push(`/project/${result.id}`);
									}
									if (result.type === "nft") {
										router.push(`/nft/${result.id}`);
									}
									setIsSearchDropdownOpen(false);
								}}
								className="flex space-x-4 items-center bg-white px-2 py-3 border-b hover:bg-gray-100 cursor-pointer"
							>
								<img src={result.type === "project" ? result.bannerImage : result.type === "nft" ? result.nftUrl : ""} alt="" className="h-10 w-10 object-cover" />
								{result.type === "project" ? (
									<p className={`${searchInput.includes(result.projectName) && "text-blue-500 font-semibold"}`}>
										{result.projectName.length < 24 ? capitalizeFirstLetter(result.projectName) : capitalizeFirstLetter(result.projectName.slice(0, 24)) + "..."}
										<span className="text-xs text-gray-500 italic"> - Project</span>
									</p>
								) : (
									<p className={`${searchInput.includes(result.name) && "text-blue-500 font-semibold"}`}>
										{result.name.length < 24 ? capitalizeFirstLetter(result.name) : capitalizeFirstLetter(result.name.slice(0, 24)) + "..."}
										<span className="text-xs text-gray-500 italic"> - NFT</span>
									</p>
								)}
							</div>
						))
					) : (
						<p className="text-gray-500 font-light mt-4 italic text-center">No relevant results found...</p>
					)
				) : (
					<div className="w-full flex justify-center py-2">
						<svg role="status" className="inline w-10 h-10 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
						</svg>
					</div>
				)}
			</div>
		</div>
	);
}
export default SearchDropdown;
