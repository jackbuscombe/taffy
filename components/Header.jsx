import Image from "next/image";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { UserCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

function Header() {
	const [userAddress, setUserAddress] = useState();

	const router = useRouter();
	const { authenticate, logout, isAuthenticated, isAuthenticating, account, user } = useMoralis();

	const handleAuth = () => {
		if (!isAuthenticated) {
			authenticate();
		} else {
			logout();
		}
	};

	return (
		<header className="bg-[#252d46] sticky top-0 flex justify-around w-full py-4 items-center text-sm text-white z-50">
			{/* Left */}
			<div className="flex items-center justify-between space-x-12">
				<Image onClick={() => router.push("/")} src={"/logo_color_2.png"} width={70} height={40} className="cursor-pointer" />
				<div className="hidden sm:flex bg-[#3b4258] items-center flex-1 rounded-md p-2 w-60 shadow-md hover:bg-slate-600">
					<input type="text" name="" id="" placeholder="Search" className="bg-transparent text-white placeholder:text-[#aaaaac] flex-1 outline-none text-sm" />
				</div>
				<nav className="hidden md:grid grid-cols-5 gap-6 items-center text-center p-2">
					<p onClick={() => router.push("/projects")} className="nav-item">
						Projects
					</p>
					<p onClick={() => router.push("/nfts")} className="nav-item">
						NFTs
					</p>
					<p onClick={() => router.push("/voting")} className="nav-item">
						Voting
					</p>
					<p onClick={() => router.push("/rewards")} className="nav-item">
						Rewards
					</p>
					<p onClick={() => router.push("/about")} className="nav-item">
						About
					</p>
				</nav>
			</div>

			{/* Right */}
			<button onClick={handleAuth} className="bg-[#253c4b] text-[#21c275] px-8 py-2 rounded-md font-semibold shadow-md flex items-center">
				{isAuthenticating && (
					<svg role="status" className="inline w-4 h-4 mr-3 text-[#21c275] animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
					</svg>
				)}
				{isAuthenticated ? (
					<div className="flex space-x-2 items-center">
						<UserCircleIcon className="h-4 w-4" />
						<p>{`${account?.slice(0, 5)}...${account?.slice(account?.length - 5)}`}</p>
					</div>
				) : (
					"Connect"
				)}
			</button>
		</header>
	);
}
export default Header;
