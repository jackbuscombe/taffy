import { XIcon } from "@heroicons/react/outline";
import { addDoc, arrayUnion, collection, doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMoralis } from "react-moralis";
import { db } from "../firebase";
import capitalizeFirstLetter from "../hooks/capitalizeFirstLetter";
import dateToUnix from "../hooks/dateToUnix";

function BackProjectModal({ setIsBackingModalOpen, id, endTime, projectName, tokenId, tokenPrice, projectTicker }) {
	const [ethBalance, setEthBalance] = useState(5.1232323);
	const [backingAmount, setBackingAmount] = useState();
	const [termsAgreed, setTermsAgreed] = useState(false);
	const [outputAmount, setOutputAmount] = useState(0);
	const { account } = useMoralis();
	const router = useRouter();

	const confirmContribution = async () => {
		toast.loading("Making contribution");

		if (!account) {
			toast.error("There was no account found. Make sure you are signed in and try again.");
			return;
		}

		if (!termsAgreed) {
			toast.error("You may not contribute without agreeing to the Taffy terms.");
		}

		try {
			let currentHoldings = 0;

			const docSnap = await getDoc(doc(db, "tokens", tokenId, "holders", account));
			if (docSnap.exists()) {
				currentHoldings = docSnap.data().balance;
				console.log("Current Holdings", currentHoldings);
			}

			// Update Holders in token collect
			await setDoc(
				doc(db, "tokens", tokenId, "holders", account),
				{
					balance: currentHoldings + backingAmount / tokenPrice,
				},
				{ merge: true }
			);

			// Update Holdings in user collection
			await setDoc(
				doc(db, "users", account, "holdings", tokenId),
				{
					balance: currentHoldings + backingAmount / tokenPrice,
				},
				{ merge: true }
			);

			// MAYBE we just have contributions as an array -> where for every contribution an object is added containing:
			// 1. Contributor Address (this will be the id)
			// 2. Contribution time
			// 3. Contribution Timestamp
			await updateDoc(doc(db, "projects", id), {
				contributions: arrayUnion({
					contributor: account,
					contribution: backingAmount,
					contributionTimestamp: Date.now() / 1000,
				}),
			});

			await addDoc(collection(db, "users", account, "contributions"), {
				amount: backingAmount,
				contributionTimestamp: Date.now() / 1000,
				projectId: id,
			});

			await updateDoc(doc(db, "projects", id), {
				contributionsCount: increment(1),
			});
			await updateDoc(doc(db, "projects", id), {
				contributionsValue: increment(backingAmount),
			});
			toast.dismiss();
			toast.success("Your contrubution was successful!");
			router.reload();
		} catch (error) {
			toast.dismiss();
			toast.error("There was an error contributing to the project.");
			console.log(error);
			return;
		}

		setIsBackingModalOpen(false);
	};

	useEffect(() => {
		if (!tokenPrice) {
			return;
		}

		if (!backingAmount) {
			setOutputAmount(0);
			return;
		}

		let calulatedOutputAmount = backingAmount / tokenPrice;

		setOutputAmount(calulatedOutputAmount);
	}, [backingAmount, tokenPrice]);

	return (
		<div className="z-50 h-[80vh] w-[80vh] fixed top-[5vh] bottom-[5vh] left-[20vw] right-[20vw] overflow-y-scroll scrollbar-hide m-auto bg-white rounded-lg p-6 shadow-lg text-gray-700 text-sm">
			<div className="flex justify-between items-center">
				<h2 className="text-xl mb-2">Back {capitalizeFirstLetter(projectName)}</h2>
				<XIcon onClick={() => setIsBackingModalOpen(false)} className="h-10 w-10 cursor-pointer p-2 hover:bg-gray-300 rounded-full" />
			</div>
			<p className="text-gray-500 mb-4">Nor again is there anyone who loves or pursues or desires to obtain pain of itself</p>
			<hr className="border-gray-200 mb-4" />

			<div className="flex text-gray-500 mb-4">
				<p>
					Balance:{" "}
					<span onClick={() => setBackingAmount(ethBalance)} className="text-blue-500 cursor-pointer">
						{ethBalance} ETH
					</span>
				</p>
			</div>

			<div className="w-full border border-gray-200 flex justify-between p-2 mb-4">
				<input type="number" placeholder="0 ETH" className="flex-grow flex-1 outline-none placeholder:text-gray-400" value={`${backingAmount}`} onChange={(e) => setBackingAmount(parseFloat(e.target.value))} />
				<p onClick={() => setBackingAmount(ethBalance)} className="font-semibold text-gray-400 cursor-pointer">
					MAX
				</p>
			</div>

			<div className="flex justify-between mb-4">
				<p className="text-gray-500">
					You will get{" "}
					<span className="text-xs text-gray-400">
						(based on price: {tokenPrice}ETH = 1{projectTicker.toUpperCase()})
					</span>
				</p>
				<p className="font-semibold">
					{outputAmount.toFixed(5)} {projectTicker.toUpperCase()}
				</p>
			</div>

			<hr className="border-gray-200 mb-4" />

			<div className="flex space-x-2 mb-4 items-center">
				<input type="checkbox" checked={termsAgreed} onChange={() => setTermsAgreed(!termsAgreed)} className="cursor-pointer" />
				<p className="text-gray-500">
					I agree to the <span className="underline">Terms and Conditions</span>
				</p>
			</div>

			<button disabled={!termsAgreed || !backingAmount} onClick={confirmContribution} className="w-full py-2 rounded-md font-semibold mb-4 bg-blue-500 text-white border hover:bg-blue-600 disabled:bg-transparent disabled:text-gray-500 disabled:outline-gray-500 disabled:cursor-not-allowed transition transform ease-in-out">
				Confirm
			</button>

			<p className="text-gray-500">This is an all or nothing and if project doesn't raise funds by {endTime} then funds will be returned. </p>
			<Toaster />
		</div>
	);
}
export default BackProjectModal;
