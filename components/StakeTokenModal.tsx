import { XIcon } from "@heroicons/react/outline";
import { addDoc, arrayUnion, collection, doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMoralis } from "react-moralis";
import { db } from "../firebase";
import capitalizeFirstLetter from "../hooks/capitalizeFirstLetter";
import dateToUnix from "../hooks/dateToUnix";

function StakeTokenModal({ setIsStakingModalOpen, tokenId, userTokenBalance, endTime, projectName, tokenPrice, tokenTicker }: any) {
	const [tokenBalance, setTokenBalance] = useState(userTokenBalance);
	const [stakingAmount, setStakingAmount] = useState<number | undefined>();
	const [currentStakeAmount, setCurrentStakeAmount] = useState<number | undefined>();
	const [termsAgreed, setTermsAgreed] = useState(false);
	const [outputAmount, setOutputAmount] = useState(0);
	const { account } = useMoralis();
	const router = useRouter();

	const confirmStake = async () => {
		toast.loading("Confirming Stake");

		if (!account) {
			toast.error("There was no account found. Make sure you are signed in and try again.");
			return;
		}

		if (!stakingAmount) {
			toast.error("You must enter a non-zero amount to stake");
			return;
		}

		if (stakingAmount < 0 || stakingAmount == 0) {
			toast.error("You must enter a positive staking amount");
		}

		if (!termsAgreed) {
			toast.error("You may not contribute without agreeing to the Taffy terms.");
		}

		try {
			let balance = 0;
			let currentStake = 0;

			const docSnap = await getDoc(doc(db, "tokens", tokenId, "holders", account));
			if (docSnap.exists()) {
				balance = docSnap.data().balance;
				currentStake = docSnap.data().stakedAmount ?? 0;
			}

			if (stakingAmount > balance) {
				toast.dismiss();
				toast.error("You can not stake more than your balance!");
				return;
			}

			// Update Holders in token collection
			await setDoc(
				doc(db, "tokens", tokenId, "holders", account),
				{
					balance: balance - stakingAmount,
					stakedAmount: currentStake + stakingAmount,
				},
				{ merge: true }
			);

			// Update Staked amount in project
			await setDoc(
				doc(db, "projects", tokenId),
				{
					amountStaked: currentStake + stakingAmount,
				},
				{ merge: true }
			);

			// Update Holdings in user collection
			await setDoc(
				doc(db, "users", account, "holdings", tokenId),
				{
					balance: balance - stakingAmount,
					stakedAmount: currentStake + stakingAmount,
				},
				{ merge: true }
			);

			toast.dismiss();
			toast.success("Your stake was successfully submitted!");
			setIsStakingModalOpen(false);
		} catch (error) {
			toast.dismiss();
			toast.error("There was an error making your stake.");
			console.log(error);
			return;
		}

		setIsStakingModalOpen(false);
	};

	// Find current stake amount
	useEffect(() => {
		if (!account || !tokenId) {
			return;
		}

		async function getCurrentStakeAmount() {
			if (typeof account !== "string") {
				return;
			}

			const stakedSnap = await getDoc(doc(db, "tokens", tokenId, "holders", account));

			if (stakedSnap.exists()) {
				setTokenBalance(stakedSnap.data().balance ?? 0);
				setCurrentStakeAmount(stakedSnap.data().stakedAmount ?? 0);
			} else {
				setTokenBalance(0);
				setCurrentStakeAmount(0);
			}
		}

		getCurrentStakeAmount();
	}, [account, tokenId]);

	return (
		<div className="z-50 fixed flex flex-col justify-start top-[3vh] bottom-[3vh] left-[15vw] right-[15vw] overflow-y-scroll scrollbar-hide m-auto bg-white rounded-lg p-6 shadow-lg text-gray-700 text-sm">
			<div className="flex justify-between items-center">
				<h2 className="text-xl mb-2">Stake {capitalizeFirstLetter(projectName)}</h2>
				<XIcon onClick={() => setIsStakingModalOpen(false)} className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer sm:p-2 hover:bg-gray-300 rounded-full" />
			</div>
			<p className="text-gray-500 mb-4">Nor again is there anyone who loves or pursues or desires to obtain pain of itself</p>
			<hr className="border-gray-200 mb-4" />

			<div className="flex text-gray-500 mb-4">
				<p>
					Balance:{" "}
					<span onClick={() => setStakingAmount(tokenBalance)} className="text-blue-500 cursor-pointer">
						{tokenBalance} {tokenTicker.toUpperCase()}
					</span>
				</p>
			</div>

			<div className="w-full border border-gray-200 flex flex-col sm:flex-row justify-between p-2 mb-4">
				<input type="number" placeholder={`0 ${tokenTicker.toUpperCase()}`} className="flex-grow flex-1 outline-none placeholder:text-gray-400" value={stakingAmount} onChange={(e) => setStakingAmount(parseFloat(e.target.value))} />
				<p onClick={() => setStakingAmount(tokenBalance)} className="font-semibold text-gray-400 cursor-pointer">
					MAX
				</p>
			</div>

			<div className="flex flex-col sm:flex-row justify-between mb-4">
				<p className="text-gray-500">Currently Staked</p>
				<p className="font-semibold">
					{currentStakeAmount?.toFixed(5)} {tokenTicker.toUpperCase()}
				</p>
			</div>

			<hr className="border-gray-200 mb-4" />

			<div className="flex space-x-2 mb-4 items-center">
				<input type="checkbox" checked={termsAgreed} onChange={() => setTermsAgreed(!termsAgreed)} className="cursor-pointer" />
				<p className="text-gray-500">
					I agree to the <span className="underline">Terms and Conditions</span>
				</p>
			</div>

			<button disabled={!termsAgreed || !stakingAmount} onClick={confirmStake} className="w-full py-2 rounded-md font-semibold mb-4 bg-blue-500 text-white border hover:bg-blue-600 disabled:bg-transparent disabled:text-gray-500 disabled:outline-gray-500 disabled:cursor-not-allowed transition transform ease-in-out">
				Confirm
			</button>

			<p className="text-gray-500">Confirming this will send your funds to the staking contract. Staking will give you the opportunity to win NFT lotteries and you will be able to withdraw these funds after {endTime}</p>
			<Toaster />
		</div>
	);
}
export default StakeTokenModal;
