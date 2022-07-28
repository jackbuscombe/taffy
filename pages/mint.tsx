import { ChevronDownIcon, PaperClipIcon } from "@heroicons/react/outline";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import { db, storage } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { XIcon } from "@heroicons/react/outline";
import capitalizeFirstLetter from "../hooks/capitalizeFirstLetter";

function Mint() {
	const router = useRouter();
	const { account, user, enableWeb3, logout } = useMoralis();
	const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState<any>();

	const projectDropdownWrapperRef = useRef(null);
	useOutsideAlerter(projectDropdownWrapperRef);

	const [image, setImage] = useState<Blob | Uint8Array | ArrayBuffer | undefined>();
	const filePickerRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (e: any) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
			(document.getElementById("nftImage") as HTMLImageElement).src = URL.createObjectURL(e.target.files[0]);
		}
	};

	const handleImageDialogue = () => {
		// 👇️ open file input box on click of other element
		filePickerRef.current?.click();
	};

	const name = useRef<HTMLInputElement>(null);
	const description = useRef<HTMLTextAreaElement>(null);
	const [traitCount, setTraitCount] = useState<number>(0);

	useEffect(() => {
		enableWeb3();
	}, [user]);

	const uploadImage = async (nftId: string) => {
		if (!image) {
			toast.error("Please add an image to upload");
			return;
		}

		return new Promise(function (resolve, reject) {
			const loadingToast = toast.loading("Uploading NFT");
			const storageRef = ref(storage, `nfts/${account}/${nftId}`);
			const uploadTask = uploadBytesResumable(storageRef, image);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					toast.loading("Upload is " + progress + "% done", {
						id: loadingToast,
					});
					switch (snapshot.state) {
						case "paused":
							toast("Upload is paused");
							break;
					}
				},
				(error) => {
					switch (error.code) {
						case "storage/unauthorized":
							toast.error("User doesn't have permission to access the object");
							break;
						case "storage/canceled":
							toast.error("User canceled the upload");
							break;
						case "storage/unknown":
							toast.error("Unknown error occurred, inspect error.serverResponse");
							break;
					}
					reject();
				},
				async () => {
					// Upload completed successfully, now we can get the download URL
					await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						console.log("The download URL is", downloadURL);
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const mintNft = async () => {
		toast.loading("Minting NFT");

		// Form Error Handling
		if (!name.current?.value) {
			name.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
			setTimeout(() => {
				name.current?.focus();
			}, 500);
			return toast.error("You must enter a name");
		}

		if (!image) {
			document.getElementById("image_button")?.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
			setTimeout(() => {
				document.getElementById("image_button")?.focus();
			}, 500);
			return toast.error("You must choose a file to upload");
		}

		if (!selectedProject) {
			document.getElementById("project_select")?.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
			setTimeout(() => {
				document.getElementById("project_select")?.focus();
			}, 500);
			return toast.error("You must select a project to mint to");
		}

		// Build Traits Object
		let traitsObject: Object[] = [];
		let traitName;
		let traitValue;

		for (let i = 0; i < traitCount; i++) {
			traitName = (document.getElementById(`trait_${i}`) as HTMLInputElement).value || "name";
			traitValue = (document.getElementById(`trait_${i}_value`) as HTMLInputElement).value;
			traitsObject.push({
				traitName: traitName,
				traitValue: traitValue,
			});
		}

		// Get Creator Image
		if (typeof account !== "string") {
			return;
		}

		let creatorImage;
		const userRef = doc(db, "users", account);
		const docSnap = await getDoc(userRef);

		if (docSnap.exists()) {
			creatorImage = docSnap.data().profileImage;
		} else {
			return;
		}

		try {
			const docRef = await addDoc(collection(db, "nfts"), {
				nftUrl: "",
				name: name.current.value.toLowerCase(),
				description: description.current?.value || "",
				createdTimestamp: Date.now() / 1000,
				creatorAddress: account,
				creatorImage: creatorImage,
				creatorName: "Jack Buscombe",
				mintTimestamp: Date.now(),
				projectId: selectedProject.id,
				projectName: selectedProject.projectName,
				views: 0,
				price: 1,
				contractAddress: "0x772",
				tokenId: 32,
				tokenStandard: "ERC20",
				chain: "Ethereum",
				creatorFees: 5,
				traits: traitsObject,
			});

			// Upload NFT Image Here First
			const nftUrl = await uploadImage(docRef.id);
			console.log("The image URL is", nftUrl);

			updateDoc(doc(db, "nfts", docRef.id), {
				nftUrl: nftUrl,
			});

			toast.dismiss();
			toast.success("Successfully minted NFT!");
			router.push(`/nft/${docRef.id}`);
		} catch (error) {
			toast.dismiss();
			toast.error("There was an Error minting your NFT");
		}
	};

	const handleLogout = async () => {
		await logout();
		router.push("/");
	};

	const [userProjects, setUserProjects] = useState<any>();

	useEffect(() => {
		if (!account) {
			return;
		}

		async function queryDatabase() {
			let updatedResults: any = [];
			const searchRef = collection(db, "projects");
			const q = query(searchRef, where("creatorAddress", "==", account));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc: any) => {
				updatedResults.push({
					id: doc.id,
					...doc.data(),
				});
			});
			console.log(updatedResults);
			setUserProjects(updatedResults);
		}

		queryDatabase();
	}, [account]);

	function useOutsideAlerter(ref: any) {
		useEffect(() => {
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsProjectDropdownOpen(false);
				}
			}
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	useEffect(() => {
		if (Object.keys(router.query).length > 0) {
			setSelectedProject(router.query);
		}
	}, [router.query]);

	return (
		<main className="w-full bg-blue-50 flex justify-center py-8">
			<div className="flex flex-col justify-items-center bg-white w-11/12 px-6 md:w-3/4 md:px-24 py-8 divide-y text-gray-700 text-center">
				{/* Row 1 */}
				<div className="flex flex-col py-4">
					<div className="flex flex-col md:flex-row items-center text-center py-4 md:space-x-20 space-y-6 md:space-y-0">
						<h1 className="w-full md:w-1/3 text-2xl font-bold text-gray-900">Mint NFT</h1>
						<div className="bg-[url('/watch_mint_bg.png')] w-full md:w-2/3 h-24 flex justify-center md:justify-start items-center px-8 cursor-pointer hover:opacity-90 transition transform ease-in-out">
							<img src="/watch_mint_text.png" alt="" className="" />
						</div>
					</div>

					<div className="flex flex-col md:flex-row py-8 md:items-center md:space-x-20 space-y-6 md:space-y-0">
						<p className="md:w-1/3 font-semibold">Creator Wallet Address</p>
						<div className="md:w-2/3 flex flex-col justify-center space-y-3">
							<p className="break-words md:hidden">{account}</p>
							<p className="hidden md:block mb-4 break-words">{account}</p>
							<button onClick={handleLogout} className="bg-green-500 text-white px-4 py-2 rounded-sm font-semibold hover:bg-transparent border-[1px] hover:text-green-500 border-green-500 transition transform ease-in-out">
								Change Wallet
							</button>
						</div>
					</div>
				</div>

				{/* Select Project Row */}
				<div id="project_select" className="flex flex-col md:flex-row md:items-center py-8 md:space-x-20 space-y-6 md:space-y-0">
					<p className="md:w-1/3 font-semibold">
						Select Project <span className="text-red-500">*</span>
					</p>
					<div className="md:w-2/3">
						<div onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)} className="flex items-center justify-between h-16 border-[1px] border-gray-200 rounded-sm px-4 py-2 cursor-pointer bg-white hover:bg-gray-100">
							<div className="block items-center w-full">
								{selectedProject ? (
									<div className="flex justify-between items-center w-full">
										<div className="flex space-x-4 items-center cursor-pointer">
											<img src={selectedProject.projectImage} alt="" className="h-10 w-10" />
											<p className="font-semibold">{selectedProject.projectName.length < 24 ? capitalizeFirstLetter(selectedProject.projectName) : capitalizeFirstLetter(selectedProject.projectName.slice(0, 24)) + "..."}</p>
										</div>
										<ChevronDownIcon className="h-6 w-6" />
									</div>
								) : (
									<div className="flex justify-between">
										<p>Select project</p>
										<ChevronDownIcon className="h-6 w-6" />
									</div>
								)}
							</div>
						</div>
						{isProjectDropdownOpen && (
							<div ref={projectDropdownWrapperRef} className="absolute border bg-white text-black font-semibold p-2">
								{userProjects ? (
									userProjects.length > 0 ? (
										userProjects.map((result: any, i: number) => (
											<div
												key={i}
												onClick={() => {
													setSelectedProject(result);
													setIsProjectDropdownOpen(false);
												}}
												className="flex space-x-4 items-center bg-white p-2 border-b hover:bg-gray-100 cursor-pointer"
											>
												<img src={result.projectImage} alt="" className="h-10 w-10" />
												<p>{result.projectName.length < 24 ? capitalizeFirstLetter(result.projectName) : capitalizeFirstLetter(result.projectName.slice(0, 24)) + "..."}</p>
											</div>
										))
									) : (
										<p className="text-gray-500 font-light mt-4 italic text-center p-3">
											You must{" "}
											<span onClick={() => router.push("/new-project")} className="text-blue-500 cursor-pointer hover:underline font-semibold">
												create a project
											</span>{" "}
											before minting an NFT!
										</p>
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
						)}
					</div>
				</div>

				{/* Row 2 */}
				<div className="flex flex-col md:flex-row py-8 md:items-center md:space-x-20 space-y-6 md:space-y-0">
					<p className="md:w-1/3 font-semibold">
						NFT name <span className="text-red-500">*</span>
					</p>
					<input ref={name} type="text" placeholder="NFT name" className="md:w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
				</div>

				{/* Row 3 */}
				<div className="flex flex-col md:flex-row py-8 md:space-x-20 space-y-6 md:space-y-0">
					<div className="md:w-1/3 space-y-2">
						<p className="font-semibold">NFT description</p>
						<p className="font-light text-sm">The description will be included on the items detail page underneath its image. Markdown syntax is supported.</p>
					</div>
					<textarea ref={description} placeholder="Description" className="md:w-2/3 h-28 border-[1px] border-gray-200 rounded-sm px-4 py-2 resize-none" />
				</div>

				{/* Row 4 */}
				<div className="flex flex-col md:flex-row py-8 md:space-x-20 space-y-6 md:space-y-0">
					<div className="md:w-1/3 space-y-2">
						<p className="font-semibold">
							File <span className="text-red-500">*</span>
						</p>
						<p className="font-light text-sm">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</p>
					</div>
					<div className="md:w-2/3 flex justify-center">
						{!image && (
							<button id="image_button" onClick={handleImageDialogue} className="flex items-center h-20 border-[1px] border-gray-200 rounded-sm px-10 py-1 hover:bg-blue-500 hover:text-white group transition transform ease-in-out">
								<PaperClipIcon className="h-6 w-6 mr-2" />
								<p className="text-blue-500 font-semibold group-hover:text-white">Add Image</p>
							</button>
						)}
						<img onClick={handleImageDialogue} id="nftImage" src="" alt="NFT Image" className={`h-32 w-32 cursor-pointer rounded-sm hover:opacity-90 transition transform ease-in-out ${!image && "hidden"}`} />
						<input ref={filePickerRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
					</div>
				</div>

				{/* Row 5 */}
				<div className="">
					<div className="flex flex-col md:flex-row py-8 md:space-x-20 space-y-3 md:space-y-0">
						<div className="md:w-1/3 space-y-2">
							{/* <p className="font-semibold">
							File <span className="text-red-500">*</span>
						</p> */}
							<p className="font-semibold">Add traits</p>
							<p className="font-light text-sm">Add traits to your NFT. You may add up to 10 unique traits with corresponding values.</p>
						</div>
						<div className="md:w-2/3 px-4 flex flex-col items-center">
							<div id="traits_container">
								{/* <div id="trait_row" className="flex space-x-2 mb-2">
									<input ref={trait1} type="text" placeholder="Trait 1 Name" className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
									<input ref={traitValue1} type="text" placeholder="Trait 1 Value" className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
								</div>
								<div id="trait_row" className="flex space-x-2 mb-2">
									<input ref={trait2} type="text" placeholder="Trait 2 Name" className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
									<input ref={traitValue2} type="text" placeholder="Trait 2 Value" className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
								</div> */}
								{[...Array(traitCount)].map((_, i) => (
									// <TraitContainer key={i} traitNumber={i + 1} />
									<div key={i} className="flex items-center space-x-2 mb-2">
										<input id={`trait_${i}`} type="text" placeholder={`Trait ${i} Name`} className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
										<input id={`trait_${i}_value`} type="text" placeholder={`Trait ${i} Value`} className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
										<XIcon onClick={() => setTraitCount(traitCount - 1)} className="h-8 w-8 text-gray-300 cursor-pointer hover:text-black hover:scale-110" />
									</div>
								))}
							</div>
							<button
								onClick={() => {
									if (traitCount >= 10) {
										toast.dismiss();
										toast(
											<p>
												😱 You may have a <span className="font-bold text-red-500">maximum</span> of 10 traits
											</p>
										);
										return;
									}
									setTraitCount(traitCount + 1);
								}}
								className="text-blue-500 px-4 py-2 mt-4 rounded-sm font-semibold hover:bg-blue-500 border-[1px] hover:text-white border-gray-300 transition transform ease-in-out"
							>
								+ Add New Trait
							</button>
						</div>
					</div>

					{/* Submit Row */}
					<div className="w-full flex flex-col-reverse md:flex-row justify-center md:space-x-6 py-8">
						<button onClick={() => router.back()} className="text-gray-500 md:px-20 py-2 rounded-sm font-semibold hover:bg-gray-500 border-[1px] hover:text-white border-gray-300 transition transform ease-in-out">
							Cancel
						</button>
						<button onClick={mintNft} className="bg-blue-500 text-white md:px-20 py-2 mb-2 md:mb-0 rounded-sm font-semibold hover:bg-transparent border-[1px] hover:text-blue-500 border-blue-500 transition transform ease-in-out">
							Mint
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
export default Mint;
