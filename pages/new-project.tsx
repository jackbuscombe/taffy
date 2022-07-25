import { PaperClipIcon, PlusIcon, SwitchHorizontalIcon, XIcon } from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import { collection, query, where, onSnapshot, doc, orderBy, setDoc, serverTimestamp, addDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
// import { Calendar } from "react-date-range";
import fromUnixTime from "date-fns/fromUnixTime";
import dateToUnix from "../hooks/dateToUnix";
import unixToDateTime from "../hooks/unixToDateTime";

function NewProject() {
	const router = useRouter();
	const [isPublishing, setIsPublishing] = useState(false);
	const { account, user, enableWeb3, logout } = useMoralis();

	const projectNameRef = useRef<HTMLInputElement>(null);
	const projectTickerRef = useRef<HTMLInputElement>(null);
	const [projectTicker, setProjectTicker] = useState<string | undefined>();
	const projectDescriptionRef = useRef<HTMLTextAreaElement>(null);
	const raiseAmountRef = useRef<HTMLInputElement>(null);
	const [tokenPrice, setTokenPrice] = useState<number | undefined>();
	const tokenPriceRef = useRef<HTMLInputElement>(null);
	const [isApyActive, setIsApyActive] = useState<boolean>(false);
	const [apy, setApy] = useState<number | undefined>();
	const apyRef = useRef<HTMLInputElement>(null);
	// const endDateRef = useRef<HTMLInputElement>(null);
	const frequencyRef = useRef<HTMLSelectElement>(null);
	const linkedInRef = useRef<HTMLInputElement>(null);
	const twitterRef = useRef<HTMLInputElement>(null);
	const telegramRef = useRef<HTMLInputElement>(null);
	const discordRef = useRef<HTMLInputElement>(null);

	const [tagInput, setTagInput] = useState<string | undefined>();
	const [tags, setTags] = useState<string[]>([]);

	const [projectImage, setProjectImage] = useState<Blob | Uint8Array | ArrayBuffer | undefined>();
	const [bannerImage, setBannerImage] = useState<Blob | Uint8Array | ArrayBuffer | undefined>();

	const projectImagePickerRef = useRef<HTMLInputElement>(null);
	const bannerImagePickerRef = useRef<HTMLInputElement>(null);

	const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

	const [endDate, setEndDate] = useState<number>(0);

	useEffect(() => {
		enableWeb3();
	}, [user]);

	const handleProjectImageChange = (e: any) => {
		if (e.target.files[0]) {
			setProjectImage(e.target.files[0]);
			(document.getElementById("project_image") as HTMLImageElement).src = URL.createObjectURL(e.target.files[0]);
		}
	};

	const handleBannerImageChange = (e: any) => {
		if (e.target.files[0]) {
			setBannerImage(e.target.files[0]);
			(document.getElementById("banner_image") as HTMLImageElement).src = URL.createObjectURL(e.target.files[0]);
		}
	};

	const handleProjectImageDialogue = () => {
		// 👇️ open file input box on click of other element
		projectImagePickerRef.current?.click();
	};

	const handleBannerImageDialogue = () => {
		// 👇️ open file input box on click of other element
		bannerImagePickerRef.current?.click();
	};

	const uploadProjectImage = async (projectId: string) => {
		if (!projectImage) {
			document.getElementById("project_image_button")?.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
			return toast.error("You must choose a project image to upload");
		}

		return new Promise(function (resolve, reject) {
			const storageRef = ref(storage, `projects/${account}/${projectId}/project_image`);
			const uploadTask = uploadBytesResumable(storageRef, projectImage);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					toast.dismiss();
					toast.loading("Upload is " + progress + "% done");
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

	const uploadBannerImage = async (projectId: string) => {
		if (!bannerImage) {
			document.getElementById("banner_image_button")?.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
			return toast.error("You must choose a banner image to upload");
		}

		return new Promise(function (resolve, reject) {
			const storageRef = ref(storage, `projects/${account}/${projectId}/banner_image`);
			const uploadTask = uploadBytesResumable(storageRef, bannerImage);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					toast.dismiss();
					toast.loading("Upload is " + progress + "% done");
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

	const publishProject = async () => {
		toast.loading("Deploying token and publishing project");
		// Form Error Handling
		// errorScroll is a template for how the scroll action behaves when there is an error
		const errorScroll: ScrollIntoViewOptions = {
			behavior: "smooth",
			block: "center",
			inline: "center",
		};

		if (!projectNameRef.current?.value) {
			projectNameRef.current?.scrollIntoView(errorScroll);
			setTimeout(() => {
				projectNameRef.current?.focus();
			}, 1000);
			return toast.error("You must enter a project name");
		}

		if (!projectTicker) {
			projectTickerRef.current?.scrollIntoView(errorScroll);
			setTimeout(() => {
				projectTickerRef.current?.focus();
			}, 1000);
			return toast.error("You must enter a project ticker");
		}

		if (!raiseAmountRef.current?.value) {
			raiseAmountRef.current?.scrollIntoView(errorScroll);
			setTimeout(() => {
				raiseAmountRef.current?.focus();
			}, 1000);
			return toast.error("You must enter a raise amount");
		}

		if (!frequencyRef.current?.value) {
			frequencyRef.current?.scrollIntoView(errorScroll);
			setTimeout(() => {
				frequencyRef.current?.focus();
			}, 1000);
			return toast.error("You must enter a raise frequency");
		}

		if (!tokenPrice) {
			tokenPriceRef.current?.scrollIntoView(errorScroll);
			setTimeout(() => {
				tokenPriceRef.current?.focus();
			}, 1000);
			return toast.error("You must enter a token price");
		}

		if (tokenPrice < 0) {
			tokenPriceRef.current?.scrollIntoView(errorScroll);
			setTimeout(() => {
				tokenPriceRef.current?.focus();
			}, 1000);
			return toast.error("Your token may can not be negative.");
		}

		if (!isApyActive) {
			setApy(0);
		}

		if (!apy) {
			setApy(0);
		}

		// [important] This toLocaleString Might not be ther BEST!!
		let currentTimestamp = dateToUnix(new Date());
		// let currentTimestamp = Date.parse(new Date().toLocaleString()) / 1000;
		let dropTimestamps: number[] = [];
		let i = 0;

		do {
			currentTimestamp += i;
			// result.setDate(result.getDate() + i);
			dropTimestamps = [...dropTimestamps, currentTimestamp];
			i += parseInt(frequencyRef.current.value);
		} while (currentTimestamp < endDate);

		try {
			// Create Token
			const tokenRef = await addDoc(collection(db, "tokens"), {
				apy: apy,
				name: projectNameRef.current.value.toLowerCase(),
				ticker: projectTicker.toLowerCase(),
				tokenPrice: tokenPrice,
			});

			// Create Project
			const docRef = await addDoc(collection(db, "projects"), {
				apy,
				amountStaked: 0,
				bannerImage: "",
				contributions: [{}],
				contributionsCount: 0,
				contributionsValue: 0,
				createdTimestamp: Math.floor(Date.now() / 1000),
				creatorAddress: account,
				creatorName: "Jack",
				discord: discordRef.current?.value.toLowerCase(),
				dropDates: dropTimestamps,
				endDate: endDate,
				followers: [],
				followersCount: 0,
				frequency: frequencyRef.current.value,
				linkedIn: linkedInRef.current?.value.toLowerCase(),
				projectDescription: projectDescriptionRef.current?.value || "",
				projectImage: "",
				projectName: projectNameRef.current.value.toLowerCase(),
				projectTicker: projectTicker.toLowerCase(),
				tags,
				target: raiseAmountRef.current.value,
				telegram: telegramRef.current?.value.toLowerCase(),
				tokenId: tokenRef.id,
				tokenPrice: tokenPrice,
				twitter: twitterRef.current?.value.toLowerCase(),
				views: 0,
			});

			await updateDoc(doc(db, "tokens", tokenRef.id), {
				projectId: docRef.id,
			});

			// Upload Project Image Here First
			const projectImageUrl = await uploadProjectImage(docRef.id);
			console.log("The project image URL is", projectImageUrl);
			const bannerImageUrl = await uploadBannerImage(docRef.id);
			console.log("The banner image URL is", bannerImageUrl);

			await updateDoc(doc(db, "projects", docRef.id), {
				projectImage: projectImageUrl,
				bannerImage: bannerImageUrl,
			});

			toast.dismiss();
			toast.success("Successfully Created Project!");
			router.push(`/project/${docRef.id}`);
		} catch (error) {
			toast.dismiss();
			toast.error("There was an Error creating your project");
		}
	};

	const addTag = (e: React.MouseEvent<SVGSVGElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
		if (!tagInput) {
			return;
		}
		if (tagInput.length > 14) {
			alert("A tag may only have up to 15 characters!");
			return;
		}
		if (tags.length > 4) {
			alert("You may only add up to 5 tags!");
			return;
		}
		if (tags.includes(tagInput)) {
			alert("You cannot use the same tag twice!");
		}
		if (typeof tagInput === "string") {
			setTags([...tags, tagInput.toLowerCase()]);
			setTagInput("");
		} else {
			return;
		}
	};

	const removeTag = (tag: string) => {
		if (tags.includes(tag)) {
			let index = tags.indexOf(tag);
			setTags([...tags.slice(0, index), ...tags.slice(index + 1)]);
		}
		return;
	};

	const handleLogout = async () => {
		await logout();
		router.push("/");
	};

	const handleDateChange = (date: any) => {
		// let datel = new Date(date.getTime() + 60000 * date.getTimezoneOffset());
		// console.log("datel", date.getTimezoneOffset());

		// console.log("to utc string", datel.toUTCString());
		// setEndDate(parseInt((new Date(date.toUTCString()).getTime() / 1000).toFixed(0)));
		// console.log(Math.floor(new Date(datel.toUTCString()).getTime() / 1000)); // native Date object
		setEndDate(date);
		setIsCalendarOpen(false);
	};

	return (
		<main className="w-full bg-blue-50 flex justify-center py-8">
			<div className="flex flex-col justify-items-center bg-white w-3/4 px-24 py-8 divide-y text-gray-700">
				{/* Row */}
				<div className="flex flex-col py-4">
					<div className="flex items-center py-4 space-x-20">
						<h1 className="w-1/3 text-2xl font-bold text-gray-900">Create New Project</h1>
						<div className="bg-[url('/watch_mint_bg.png')] w-2/3 h-24 flex items-center px-8 cursor-pointer hover:opacity-90 transition transform ease-in-out">
							<img src="/watch_mint_text.png" alt="" className="" />
						</div>
					</div>

					<div className="flex py-4 space-x-20">
						<p className="w-1/3 font-semibold">Creator Wallet Address</p>
						<div className="w-2/3">
							<p className="mb-4">{account}</p>
							<button onClick={handleLogout} className="bg-green-500 text-white px-4 py-2 rounded-sm font-semibold hover:bg-transparent border-[1px] hover:text-green-500 border-green-500 transition transform ease-in-out">
								Change Wallet
							</button>
						</div>
					</div>
				</div>

				{/* Row */}
				<div className="flex items-center py-8 space-x-20">
					<p className="w-1/3 font-semibold">
						Project name <span className="text-red-500">*</span>
					</p>
					<input ref={projectNameRef} type="text" placeholder="Project name" className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
				</div>

				{/* Row */}
				<div className="flex items-center py-8 space-x-20">
					<p className="w-1/3 font-semibold">
						Project Ticker <span className="text-red-500">*</span>
					</p>
					<input ref={projectTickerRef} value={projectTicker} onChange={(e) => setProjectTicker(e.target.value)} type="text" placeholder="Project ticker (e.g. TKN)" className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2" />
				</div>

				{/* Row */}
				<div className="flex py-8 space-x-20">
					<div className="w-1/3 space-y-2">
						<p className="font-semibold">Project description</p>
						<p className="font-light text-sm">The description will be included on the items detail page underneath its image. Markdown syntax is supported.</p>
					</div>
					<textarea ref={projectDescriptionRef} placeholder="Description" className="w-2/3 h-28 border-[1px] border-gray-200 rounded-sm px-4 py-2 resize-none" />
				</div>

				{/* Row */}
				<div className="flex py-8 space-x-20">
					<div className="w-1/3 space-y-2">
						<p className="font-semibold">
							Project profile photo <span className="text-red-500">*</span>
						</p>
						<p className="font-light text-sm">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</p>
					</div>
					<div className="w-2/3">
						{!projectImage && (
							<button id="project_image_button" onClick={handleProjectImageDialogue} className="flex items-center h-20 border-[1px] border-gray-200 rounded-sm px-10 py-1 hover:bg-blue-500 hover:text-white group transition transform ease-in-out">
								<PaperClipIcon className="h-6 w-6 mr-2" />
								<p className="text-blue-500 font-semibold group-hover:text-white">Add Image</p>
							</button>
						)}
						<img onClick={handleProjectImageDialogue} id="project_image" src="" alt="Project Cover Image" className={`h-32 w-32 cursor-pointer object-cover rounded-sm hover:opacity-90 transition transform ease-in-out ${!projectImage && "hidden"}`} />
						<input ref={projectImagePickerRef} type="file" accept="image/*" onChange={handleProjectImageChange} className="hidden" />
					</div>
				</div>

				{/* Row */}
				<div className="flex py-8 space-x-20">
					<div className="w-1/3 space-y-2">
						<p className="font-semibold">
							Project banner photo <span className="text-red-500">*</span>
						</p>
						<p className="font-light text-sm">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</p>
					</div>
					<div className="w-2/3">
						{!bannerImage && (
							<button id="banner_image_button" onClick={handleBannerImageDialogue} className="flex items-center h-20 border-[1px] border-gray-200 rounded-sm px-10 py-1 hover:bg-blue-500 hover:text-white group transition transform ease-in-out">
								<PaperClipIcon className="h-6 w-6 mr-2" />
								<p className="text-blue-500 font-semibold group-hover:text-white">Add Image</p>
							</button>
						)}
						<img onClick={handleBannerImageDialogue} id="banner_image" src="" alt="Project Cover Image" className={`h-32 w-64 cursor-pointer rounded-sm hover:opacity-90 transition object-cover transform ease-in-out ${!bannerImage && "hidden"}`} />
						<input ref={bannerImagePickerRef} type="file" accept="image/*" onChange={handleBannerImageChange} className="hidden" />
					</div>
				</div>

				{/* Row */}
				<div className="">
					<div className="flex items-center py-8 space-x-20">
						<p className="w-1/3 font-semibold">
							Raise amount<span className="text-red-500">*</span>
						</p>
						<div className="w-2/3 flex justify-between items-center px-4 border-[1px] border-gray-200 rounded-sm py-2 mb-3">
							<input ref={raiseAmountRef} type="number" onWheel={(e) => (e.target as HTMLInputElement).blur()} placeholder="Amount" className="grow outline-none" />
							<p className="text-gray-500 cursor-default ml-2">ETH</p>
							{/* <input ref={telegramRef} placeholder="(optional)" type="text" className="flex-1 outline-none bg-transparent" /> */}
						</div>
					</div>

					<div className="flex items-center py-8 space-x-20">
						<div className="w-1/3 space-y-2">
							<p className="font-semibold">
								Raise end date<span className="text-red-500">*</span>
							</p>
							<p className="font-light text-sm">
								Select your <span className="font-bold">local</span> date and time for which raising additional funds will become unavailable. This will be converted to UTC.
							</p>
						</div>

						<div className="w-2/3 py-2 flex flex-col space-x-4">
							{/* <select defaultValue={0} onChange={(e) => setTimezoneOffset(parseInt(e.target.value))} className="border-[1px] border-gray-200 rounded-sm px-4 py-2">
								<option value={-12}>UTC−12:00</option>
								<option value={-11}>UTC−11:00</option>
								<option value={-10}>UTC−10:00</option>
								<option value={-9.5}>UTC−09:30</option>
								<option value={-9}>UTC−09:00</option>
								<option value={-8}>UTC−08:00</option>
								<option value={-7}>UTC−07:00</option>
								<option value={-6}>UTC−06:00</option>
								<option value={-5}>UTC−05:00</option>
								<option value={-4}>UTC−04:00</option>
								<option value={-3.5}>UTC−03:30</option>
								<option value={-3}>UTC−03:00</option>
								<option value={-2}>UTC−02:00</option>
								<option value={-1}>UTC−01:00</option>
								<option value={0}>UTC±00:00</option>
								<option value={1}>UTC+01:00</option>
								<option value={2}>UTC+02:00</option>
								<option value={3}>UTC+03:00</option>
								<option value={3.5}>UTC+03:30</option>
								<option value={4}>UTC+04:00</option>
								<option value={4.5}>UTC+04:30</option>
								<option value={5}>UTC+05:00</option>
								<option value={5.5}>UTC+05:30</option>
								<option value={5.75}>UTC+05:45</option>
								<option value={6}>UTC+06:00</option>
								<option value={6.5}>UTC+06:30</option>
								<option value={7}>UTC+07:00</option>
								<option value={8}>UTC+08:00</option>
								<option value={8.75}>UTC+08:45</option>
								<option value={9}>UTC+09:00</option>
								<option value={9.5}>UTC+09:30</option>
								<option value={10}>UTC+10:00</option>
								<option value={10.5}>UTC+10:30</option>
								<option value={11}>UTC+11:00</option>
								<option value={12}>UTC+12:00</option>
								<option value={12.75}>UTC+12:45</option>
								<option value={13}>UTC+13:00</option>
								<option value={14}>UTC+14:00</option>
							</select> */}
							<input
								// ref={endDateRef}
								type="datetime-local"
								onChange={(e) => {
									setEndDate(Date.parse(e.target.value) / 1000);
								}}
								className="w-full border-[1px] border-gray-200 rounded-sm px-4 py-2 outline-none mb-2"
							/>
							{endDate ? (
								<div className="bg-gray-100 rounded-lg p-2">
									<p>
										<span className="font-semibold">Your Time:</span> {unixToDateTime(endDate, "local")}
									</p>
									<p>
										<span className="font-semibold">UTC Conversion:</span> {unixToDateTime(endDate, "utc")}
									</p>
								</div>
							) : (
								<p>Select a date and time to preview UTC conversion.</p>
							)}
							{/* <input type="time" min="09:00" max="18:00" required className="border-[1px] border-gray-200 rounded-sm px-4 py-2 outline-none" /> */}
							{/* <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="border-[1px] border-gray-200 rounded-sm px-4 py-2">
								{endDate ? endDate.toDateString() : "Select Date"}
							</button>
							{isCalendarOpen && (
								<div className="absolute my-4">
									<Calendar onChange={handleDateChange} />
								</div>
							)} */}
						</div>
					</div>
				</div>

				{/* Row */}
				<div className="flex items-center py-8 space-x-20">
					<p className="w-1/3 font-semibold">
						Raise frequency<span className="text-red-500">*</span>
					</p>
					<select ref={frequencyRef} defaultValue={0} className="w-2/3 border-[1px] border-gray-200 rounded-sm px-4 py-2 outline-none">
						<option value={0}>Once</option>
						<option value={60}>Every Hour</option>
						<option value={1440}>Every Day</option>
						<option value={10080}>Every Week</option>
						<option value={43200}>Every 30 Days</option>
					</select>
				</div>

				{/* Row */}
				<div className="flex items-center py-8 space-x-20">
					<div className="w-1/3 space-y-2">
						<p className="font-semibold">
							Token price <span className="text-red-500">*</span>
						</p>
						<p className="font-light text-sm">{"ETH price to buy 1 token."}</p>
					</div>
					<div className="w-2/3">
						<div className="flex justify-between items-center px-4 border-[1px] border-gray-200 rounded-sm py-2 mb-3">
							<input ref={tokenPriceRef} value={tokenPrice} min={0} onChange={(e) => setTokenPrice(parseFloat(e.target.value))} type="number" onWheel={(e) => (e.target as HTMLInputElement).blur()} placeholder="Token price" className="w-full outline-none" />
							<p className="text-gray-500 cursor-default ml-2">ETH</p>
						</div>
						<div className="flex space-x-4 items-center">
							<p className="text-black font-semibold bg-gray-100 rounded-lg p-2 whitespace-nowrap">
								1 {projectTicker ? projectTicker.toUpperCase() : "TKN"} = {tokenPrice ? tokenPrice : "0"} ETH
							</p>
							<SwitchHorizontalIcon className="h-6 w-6" />
							<p className="text-black font-semibold bg-gray-100 rounded-lg p-2 whitespace-nowrap">
								1 ETH = {tokenPrice ? 1 / tokenPrice : "0"} {projectTicker ? projectTicker.toUpperCase() : "TKN"}
							</p>
						</div>
					</div>
				</div>

				{/* Row */}
				<div className="flex items-center py-8 space-x-20">
					<div className="w-1/3 space-y-2">
						<p className="font-semibold">
							Staker APY <span className="text-red-500">*</span>
						</p>
						<p className="font-light text-sm">{"% yield stakers will make annually."}</p>
					</div>
					<div className="w-2/3 flex flex-col space-y-3">
						<label className="inline-flex relative items-center cursor-pointer row-span-1">
							<input type="checkbox" value="" onChange={() => setIsApyActive(!isApyActive)} checked={isApyActive} className="sr-only peer" />
							<div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
							<span className="ml-3 text-sm font-medium text-gray-900">Add yield for stakers?</span>
						</label>
						{isApyActive && (
							<div className="row-span-1 flex justify-between items-center px-4 border-[1px] border-gray-200 rounded-sm py-2 mb-3">
								<input ref={apyRef} value={apy} min={0} onChange={(e) => setApy(parseFloat(e.target.value))} type="number" onWheel={(e) => (e.target as HTMLInputElement).blur()} placeholder="Staking APY" className="w-full outline-none" />
								<p className="text-gray-500 cursor-default ml-2">%</p>
							</div>
						)}
					</div>
				</div>

				{/* Row */}
				<div className="flex py-8 space-x-20">
					<div className="w-1/3 space-y-2">
						<p className="font-semibold">Add tags</p>
						<p className="font-light text-sm">Add tags to help users find your project. Be concise. Irrelevant tags may hinder your visibility.</p>
					</div>
					<div className="w-2/3">
						<div className="flex flex-1 justify-between items-center px-4 border-[1px] border-gray-200 rounded-sm py-2 mb-3">
							<input
								value={tagInput}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										addTag(e);
									}
								}}
								onChange={(e) => setTagInput(e.target.value)}
								type="text"
								placeholder="Enter tag"
								className="flex-1 outline-none bg-transparent"
							/>
							<PlusIcon onClick={addTag} className="text-blue-500 h-4 w-4 cursor-pointer" />
						</div>
						<div className="flex items-center space-x-2">
							{tags.map((tag, i) => (
								<div key={i} className="flex justify-between items-center space-x-3 border-[1px] px-3 py-1 text-sm text-gray-700 hover:bg-blue-400 hover:text-white cursor-default mb-3">
									<p className="font-semibold">{tag}</p>
									<XIcon onClick={() => removeTag(tag)} className="h-3 w-3 cursor-pointer" />
								</div>
							))}
						</div>
						<div>
							<h4 className="mb-2">Popular:</h4>
							<div className="flex items-center space-x-2">
								<p onClick={() => setTagInput("art")} className="bg-gray-100 text-gray-700 font-semibold p-2 rounded-lg cursor-pointer">
									art
								</p>
								<p onClick={() => setTagInput("celebrities")} className="bg-gray-100 text-gray-700 font-semibold p-2 rounded-lg cursor-pointer">
									celebrities
								</p>
								<p onClick={() => setTagInput("gaming")} className="bg-gray-100 text-gray-700 font-semibold p-2 rounded-lg cursor-pointer">
									gaming
								</p>
								<p onClick={() => setTagInput("sport")} className="bg-gray-100 text-gray-700 font-semibold p-2 rounded-lg cursor-pointer">
									sport
								</p>
								<p onClick={() => setTagInput("music")} className="bg-gray-100 text-gray-700 font-semibold p-2 rounded-lg cursor-pointer">
									music
								</p>
								<p onClick={() => setTagInput("crypto")} className="bg-gray-100 text-gray-700 font-semibold p-2 rounded-lg cursor-pointer">
									crypto
								</p>
								<p onClick={() => setTagInput("crosschain")} className="bg-gray-100 text-gray-700 font-semibold p-2 rounded-lg cursor-pointer">
									crosschain
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Row */}
				<div className="flex py-8 space-x-20">
					<p className="w-1/3 font-semibold">Add social links</p>
					<div className="w-2/3">
						<div className="flex flex-1 justify-between items-center px-4 border-[1px] border-gray-200 rounded-sm py-2 mb-3">
							<p className="text-gray-400 cursor-default mr-2">LinkedIn / </p>
							<input ref={linkedInRef} placeholder="(optional)" type="text" className="flex-1 outline-none bg-transparent" />
						</div>
						<div className="flex flex-1 justify-between items-center px-4 border-[1px] border-gray-200 rounded-sm py-2 mb-3">
							<p className="text-gray-400 cursor-default mr-2">Twitter / </p>
							<input ref={twitterRef} placeholder="(optional)" type="text" className="flex-1 outline-none bg-transparent" />
						</div>
						<div className="flex flex-1 justify-between items-center px-4 border-[1px] border-gray-200 rounded-sm py-2 mb-3">
							<p className="text-gray-400 cursor-default mr-2">Telegram / </p>
							<input ref={telegramRef} placeholder="(optional)" type="text" className="flex-1 outline-none bg-transparent" />
						</div>
						<div className="flex flex-1 justify-between items-center px-4 border-[1px] border-gray-200 rounded-sm py-2 mb-3">
							<p className="text-gray-400 cursor-default mr-2">Discord / </p>
							<input ref={discordRef} placeholder="(optional)" type="text" className="flex-1 outline-none bg-transparent" />
						</div>
					</div>
				</div>

				<div>
					{/* Submit Row */}
					<div className="w-full flex justify-center space-x-6 py-8">
						<button onClick={() => router.back()} className="text-gray-500 px-20 py-2 rounded-sm font-semibold hover:bg-gray-500 border-[1px] hover:text-white border-gray-300 transition transform ease-in-out">
							Cancel
						</button>
						<button onClick={publishProject} className="bg-blue-500 text-white px-20 py-2 rounded-sm font-semibold hover:bg-transparent border-[1px] hover:text-blue-500 border-blue-500 transition transform ease-in-out">
							{isPublishing && (
								<svg role="status" className="inline w-4 h-4 mr-3 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
								</svg>
							)}
							Publish Project
						</button>
					</div>
				</div>
			</div>
			<Toaster />
		</main>
	);
}
export default NewProject;
