import Image from "next/image";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { UserCircleIcon, PlusIcon, MenuIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useState, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import SignupModal from "../components/SignupModal";
import { useStore } from "../appStore";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import SearchDropdown from "../components/SearchDropdown";
import MobileMenu from "./MobileMenu";

// import { useAccount, useNetwork, useSignMessage } from "wagmi";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { InjectedConnector } from "wagmi/connectors/injected";

function Header() {
	const searchWrapperRef = useRef(null);
	useOutsideAlerter(searchWrapperRef);

	const { authenticate, logout, isAuthenticated, isAuthenticating, account, user, enableWeb3 } = useMoralis();
	// const { address, isConnected, isConnecting } = useAccount();
	// const { connect } = useConnect({
	// 	connector: new InjectedConnector(),
	// });
	// const { disconnect } = useDisconnect();

	const signupModalOpen = useStore((state) => state.signupModalOpen);
	const setSignupModalOpen = useStore((state) => state.setSignupModalOpen);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	const [userAddress, setUserAddress] = useState();
	const [currentPage, setCurrentPage] = useState();
	const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
	const router = useRouter();

	const handleLogin = async () => {
		if (isAuthenticated) {
			return;
		}

		try {
			const docRef = doc(db, "users", account.toLowerCase());
			console.log("this is the address", account);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log("Document data:", docSnap.data());
				await authenticate();
				toast.success("Welcome, ", docSnap.data().firstName);
				router.push(`/profile/${account}`);
			} else {
				// doc.data() will be undefined in this case
				setSignupModalOpen();
				return;
			}
		} catch (error) {
			console.log(error);
			toast.error("Unable to log in - make sure you have Metamask installed!");
		}
	};

	const handleLogout = async () => {
		await logout();
		router.push("/");
	};

	const handleHomeClick = () => {
		if (isAuthenticated) {
			router.push("/");
		} else {
			router.push("/");
		}
	};

	const debounce = (func) => {
		let timer;
		return function (...args) {
			const context = this;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				timer = null;
				func.apply(context, args);
			}, 500);
		};
	};

	const handleChange = (e) => {
		const { value } = e.target;
		setSearchInput(value);
	};

	const debouncedChange = useCallback(debounce(handleChange), []);

	// useEffect(() => {
	// 	const page = router.query();
	// 	setCurrentPage(page);
	// }, [router]);

	function useOutsideAlerter(ref) {
		useEffect(() => {
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsSearchDropdownOpen(false);
				}
			}
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	useEffect(() => {
		enableWeb3();
		// authenticate();
	}, []);

	return (
		<header className="bg-[#252d46] sticky top-0 flex justify-around w-full py-4 items-center text-sm text-white z-30">
			{/* Left */}
			<div className="flex items-center justify-between lg:space-x-12 md:space-x-2">
				<Image onClick={handleHomeClick} src={"/logo_color_2.png"} width={70} height={40} className="cursor-pointer" />
				<div ref={searchWrapperRef}>
					<div className="hidden sm:block bg-[#3b4258] items-center flex-1 rounded-md p-2 w-60 shadow-md hover:bg-slate-600">
						<input onFocus={() => setIsSearchDropdownOpen(true)} onChange={debouncedChange} type="text" name="" id="" placeholder="Search" className="bg-transparent text-white placeholder:text-[#aaaaac] w-full outline-none text-sm" />
					</div>
					{isSearchDropdownOpen && <SearchDropdown searchInput={searchInput} setIsSearchDropdownOpen={setIsSearchDropdownOpen} />}
				</div>
				<nav className="hidden md:grid md:gap-2 grid-cols-5 items-center text-center p-2">
					<p onClick={() => router.push("/projects")} className={`${currentPage == "projects" && "text-blue-500"} nav-item`}>
						Projects
					</p>
					<p onClick={() => router.push("/nfts")} className={`${currentPage == "nfts" && "text-blue-500"} nav-item`}>
						NFTs
					</p>
					<p onClick={() => router.push("/voting")} className={`${currentPage == "voting" && "text-blue-500"} nav-item`}>
						Voting
					</p>
					<p onClick={() => router.push("/rewards")} className={`${currentPage == "rewards" && "text-blue-500"} nav-item`}>
						Rewards
					</p>
					<p onClick={() => router.push("/about")} className={`${currentPage == "about" && "text-blue-500"} nav-item`}>
						About
					</p>
				</nav>
			</div>

			{/* Right */}
			<div className="flex space-x-2 md:space-x-0 justify-between">
				<div className="relative inline-block group justify-between">
					<button onClick={handleLogin} className={`${isAuthenticated ? "bg-transparent border-[1px] border-[#21c275]" : "bg-[#253c4b] text-[#21c275]"} w-20 sm:w-40 py-2 rounded-sm font-semibold shadow-md items-center`}>
						{isAuthenticating && (
							<svg role="status" className="inline w-4 h-4 mr-3 text-[#21c275] animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
							</svg>
						)}
						{isAuthenticated ? (
							<div className="flex w-full justify-between items-center px-2">
								<div className="flex space-x-2 items-center">
									{/* <UserCircleIcon className="h-4 w-4" /> */}
									<p className="flex sm:hidden">Account</p>
									<p className="hidden sm:block">{`${account?.slice(0, 5)}...${account?.slice(account?.length - 5)}`}</p>
								</div>
								<ChevronDownIcon className="h-4 w-4 text-white" />
							</div>
						) : (
							"Connect"
						)}
					</button>
					{isAuthenticated && (
						<div className="hidden absolute group-hover:block z-10 bg-white divide-y divide-gray-100 rounded shadow w-44">
							<div className="py-1 cursor-pointer">
								<div onClick={() => router.push("/new-project")} className="flex items-center px-4 py-2 text-sm font-semibold bg-green-500 text-white hover:opacity-80">
									<PlusIcon className="h-3 w-3 mr-2" />
									Create new project
								</div>
							</div>
							<div onClick={() => router.push("/mint")} className="py-1 cursor-pointer">
								<p className="block px-4 py-2 text-sm font-semibold bg-blue-500 text-white hover:opacity-80">Mint NFTs</p>
							</div>
							<div onClick={() => router.push(`/profile/${account}`)} className="py-1 cursor-pointer">
								<p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</p>
							</div>
							<div onClick={() => router.push("/settings")} className="py-1 cursor-pointer">
								<p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</p>
							</div>
							<div onClick={() => router.push("/about")} className="py-1 cursor-pointer">
								<p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Support</p>
							</div>
							<div className="py-1 cursor-pointer" onClick={handleLogout}>
								<p className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-100">Logout</p>
							</div>
						</div>
					)}
				</div>
				<button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center">
					<MenuIcon className="flex md:hidden h-8 w-8 border-[1px] rounded-sm p-2" />
				</button>
			</div>
			<div className={`absolute p-4 rounded-sm shadow ${!signupModalOpen && "hidden"}`}>
				<SignupModal />
			</div>
			<div className={`absolute ${!isMobileMenuOpen && "hidden"}`}>
				<MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
			</div>
			<Toaster />
		</header>
	);
}
export default Header;
