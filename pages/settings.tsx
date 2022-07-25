import { PaperClipIcon } from "@heroicons/react/outline";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import { db, storage } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import { UserType } from "../typings";
import capitalizeFirstLetter from "../hooks/capitalizeFirstLetter";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

// type UserType = {
// 	firstName: string;
// 	lastName: string;
// 	bio: string;
// 	profileImage: string;
// };

function Settings({ id, firstName, lastName, bio, profileImage, userCreatedTimestamp }: UserType) {
	const { account, logout } = useMoralis();
	const router = useRouter();

	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const bioRef = useRef<HTMLTextAreaElement>(null);

	const [image, setImage] = useState<Blob | Uint8Array | ArrayBuffer | string | undefined>();
	const filePickerRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (e: any) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
			(document.getElementById("profile_image") as HTMLImageElement).src = URL.createObjectURL(e.target.files[0]);
		}
	};

	const handleImageDialogue = () => {
		// 👇️ open file input box on click of other element
		filePickerRef.current?.click();
	};

	const uploadNewImage = async () => {
		if (!image || typeof image === "string") {
			return;
		}
		if (typeof account !== "string") {
			return;
		}

		const storageRef = ref(storage, `users/${account}/image`);
		await uploadBytes(storageRef, image)
			.then(async (snapshot) => {
				await getDownloadURL(snapshot.ref).then((downloadURL) => {
					updateDoc(doc(db, "users", account), {
						profileImage: downloadURL,
					});
				});
			})
			.catch((error) => {
				switch (error.code) {
					case "storage/unauthorized":
						toast.dismiss();
						toast.error("User doesn't have permission to access the object");
						break;
					case "storage/canceled":
						toast.dismiss();
						toast.error("User canceled the upload");
						break;
					case "storage/unknown":
						toast.dismiss();
						toast.error("Unknown error occurred, inspect error.serverResponse");
				}
			});
	};

	const save = async () => {
		if (!account) {
			return;
		}
		if (!firstNameRef.current?.value) {
			return;
		}

		try {
			toast.loading("Saving your details!");
			await setDoc(
				doc(db, "users", account),
				{
					firstName: firstNameRef.current.value,
					lastName: lastNameRef.current?.value ?? "",
					bio: bioRef.current?.value ?? "",
				},
				{ merge: true }
			);
			if ((document.getElementById("profile_image") as HTMLImageElement).src !== profileImage) {
				await uploadNewImage();
			}
			toast.dismiss();
			toast.success("You have successfully updated your account settings!");
			router.push(`/profile/${id}`);
		} catch (error) {
			toast.dismiss();
			toast.error("Failed to update account settings. Try again or refresh.");
		}
	};

	const handleLogout = async () => {
		await logout();
		router.push("/");
	};

	useEffect(() => {
		if (typeof firstName === undefined || typeof lastName === undefined || typeof bio === undefined || typeof profileImage === undefined || !firstNameRef.current || !lastNameRef.current || !bioRef.current) {
			return;
		}

		if (firstName !== "") {
			firstNameRef.current.value = capitalizeFirstLetter(firstName);
		}

		if (lastName !== "") {
			lastNameRef.current.value = capitalizeFirstLetter(lastName);
		}

		if (bio !== "") {
			bioRef.current.value = bio;
		}

		if (profileImage !== "") {
			(document.getElementById("profile_image") as HTMLImageElement).src = profileImage;
		}
	}, [firstName, lastName, bio, profileImage]);

	useEffect(() => {
		if (!profileImage) {
			return;
		}
		setImage(profileImage);
	}, [profileImage]);

	return (
		<main className="w-full bg-blue-50 flex justify-center py-8">
			<div className="flex flex-col justify-items-center bg-white w-3/4 px-24 py-8 divide-y text-gray-700">
				{/* Row 1 */}
				<div className="flex flex-col py-4">
					<div className="flex items-center py-4 space-x-20">
						<h1 className="w-1/3 text-2xl font-bold text-gray-900">Account Settings</h1>
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

				{/* Row 1 */}
				<div className="flex py-8 space-x-20">
					<div className="w-1/3 space-y-2">
						<p className="font-semibold">
							Profile picture <span className="text-red-500">*</span>
						</p>
						<p className="font-light text-sm">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</p>
					</div>
					<div className="w-2/3">
						{!image && (
							<button id="image_button" onClick={handleImageDialogue} className="flex items-center h-20 border-[1px] border-gray-200 rounded-sm px-10 py-1 hover:bg-blue-500 hover:text-white group transition transform ease-in-out">
								<PaperClipIcon className="h-6 w-6 mr-2" />
								<p className="text-blue-500 font-semibold group-hover:text-white">Add Image</p>
							</button>
						)}
						<img onClick={handleImageDialogue} id="profile_image" src="" alt="NFT Image" className={`h-32 w-32 cursor-pointer rounded-full hover:opacity-90 transition transform ease-in-out object-cover ${!image && "hidden"}`} />
						<input ref={filePickerRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
					</div>
				</div>

				{/* Row 2 */}
				<div className="flex items-center py-8 space-x-20">
					<p className="w-1/3 font-semibold">
						Your name <span className="text-red-500">*</span>
					</p>
					<div className="w-2/3 flex space-x-3">
						<input ref={firstNameRef} type="text" placeholder="First name" className="border-[1px] border-gray-200 rounded-sm px-4 py-2" />
						<input ref={lastNameRef} type="text" placeholder="Last name" className="border-[1px] border-gray-200 rounded-sm px-4 py-2" />
					</div>
				</div>

				{/* Row 3 */}
				<div className="flex py-8 space-x-20">
					<div className="w-1/3 space-y-2">
						<p className="font-semibold">Bio</p>
						<p className="font-light text-sm">The description will be included on the items detail page underneath its image. Markdown syntax is supported.</p>
					</div>
					<textarea ref={bioRef} placeholder="Write something about yourself" className="w-2/3 h-28 border-[1px] border-gray-200 rounded-sm px-4 py-2 resize-none" />
				</div>

				{/* Submit Row */}
				<div className="w-full flex justify-center space-x-6 py-8">
					<button onClick={() => router.push("/profile/1")} className="text-gray-500 px-20 py-2 rounded-sm font-semibold hover:bg-gray-500 border-[1px] hover:text-white border-gray-300 transition transform ease-in-out">
						Cancel
					</button>
					<button onClick={save} className="bg-blue-500 text-white px-20 py-2 rounded-sm font-semibold hover:bg-transparent border-[1px] hover:text-blue-500 border-blue-500 transition transform ease-in-out">
						Save
					</button>
				</div>
			</div>
		</main>
	);
}
export default Settings;

export async function getServerSideProps({ params }: any) {
	let id = "";
	let firstName = "";
	let lastName = "";
	let bio = "";
	let profileImage = "";
	let userCreatedTimestamp = null;

	const docRef = doc(db, "users", "0x163290dd5322db5F688b9a90d80817324A185780");
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		id = docSnap.id;
		firstName = docSnap.data().firstName;
		lastName = docSnap.data().lastName;
		bio = docSnap.data().bio;
		profileImage = docSnap.data().profileImage;
		userCreatedTimestamp = docSnap.data().userCreatedTimestamp;

		return {
			props: {
				id,
				firstName,
				lastName,
				bio,
				profileImage,
				userCreatedTimestamp,
			},
		};
	} else {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
}
