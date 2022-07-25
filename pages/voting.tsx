import { CheckIcon, ChevronDownIcon, FilterIcon } from "@heroicons/react/outline";
import { collection, getDocs, limit, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PaginationBar from "../components/PaginationBar";
import VotingCard from "../components/VotingCard";
import { db } from "../firebase";
import unixToDateTime from "../hooks/unixToDateTime";
import { ProjectType, ProposalType } from "../typings";

function Voting({ proposals }: ProposalType[] | any) {
	const [projects, setProjects] = useState<ProjectType[]>([]);
	const [sortExpanded, setSortExpanded] = useState<boolean>(false);
	const [sortedBy, setSortedBy] = useState<string>("popular");
	const { account } = useMoralis();

	// useEffect(() => {
	// 	if (!account || !db || !sortedBy) {
	// 		return;
	// 	}
	// 	onSnapshot(query(collection(db, "projects"), where("ended", "==", false), orderBy(`${sortedBy == "closing" ? "timestamp, desc" : sortedBy == "apy" ? "apy, desc" : sortedBy == "popular" ? "staked, desc" : "staked, desc"}`), startAt(0), limit(10)), (snapshot) => {
	// 		setProjects(snapshot.docs);
	// 	});
	// }, [db, account, sortedBy]);

	return (
		<div className="w-full flex flex-col items-center bg-blue-50 py-8">
			<div className="w-3/4 flex flex-col space-y-6 mb-8">
				<div className="flex flex-col sm:flex-row justify-between">
					<h1 className="text-2xl font-bold mb-2 sm:mb-0">Voting</h1>
					<div className="flex items-center space-x-2">
						<p className="text-sm">Sort by:</p>
						<div className="relative inline-block group justify-between">
							<button className={`flex justify-between w-40 p-1 border-[1px] border-gray-300 rounded-sm font-semibold items-center`}>
								<FilterIcon className="h-6 w-6 text-blue-500" />
								<div className="flex w-full justify-between items-center px-2">
									<p className="text-xs">{sortedBy == "popular" ? "Most Popular" : sortedBy == "closing" ? "Closing soonest" : sortedBy == "apy" ? "Highest APY" : sortedBy == "staked" ? "Amount staked" : ""}</p>
								</div>
								<ChevronDownIcon className="h-6 w-6 text-gray-300" />
							</button>
							<div className="hidden absolute group-hover:block z-10 bg-white divide-y divide-gray-100 rounded-sm shadow w-44">
								<div onClick={() => setSortedBy("popular")} className="flex justify-between items-center py-1 cursor-pointer px-4 text-gray-700 hover:bg-gray-100">
									<p className="block py-2 text-sm text-gray-700 hover:bg-gray-100">Most Popular</p>
									{sortedBy == "popular" && <CheckIcon className="h-4 w-4 text-green-500" />}
								</div>
								<div onClick={() => setSortedBy("closing")} className="flex justify-between items-center py-1 cursor-pointer px-4 text-gray-700 hover:bg-gray-100">
									<p className="block py-2 text-sm text-gray-700 hover:bg-gray-100">Closing soonest</p>
									{sortedBy == "closing" && <CheckIcon className="h-4 w-4 text-green-500" />}
								</div>
								<div onClick={() => setSortedBy("apy")} className="flex justify-between items-center py-1 cursor-pointer px-4 text-gray-700 hover:bg-gray-100">
									<p className="block py-2 text-sm">Highest APY</p>
									{sortedBy == "apy" && <CheckIcon className="h-4 w-4 text-green-500" />}
								</div>
								<div onClick={() => setSortedBy("staked")} className="flex justify-between items-center py-1 cursor-pointer px-4 text-gray-700 hover:bg-gray-100">
									<p className="block py-2 text-sm text-gray-700 hover:bg-gray-100">Amount staked</p>
									{sortedBy == "staked" && <CheckIcon className="h-4 w-4 text-green-500" />}
								</div>
							</div>
						</div>
					</div>
				</div>

				{proposals.map((proposal: any, i: number) => (
					<VotingCard key={proposal.id} proposalId={proposal.id} title={proposal.title} description={proposal.description} question={proposal.question} options={proposal.options} projectId={proposal.projectId} projectName={proposal.projectName} projectTicker={proposal.projectTicker} projectImage={proposal.projectImage} timeLeft={unixToDateTime(proposal.votingCloseTimestamp, "local")} />
				))}
			</div>

			<div className="w-3/4">
				<PaginationBar />
			</div>
		</div>
	);
}
export default Voting;

export async function getServerSideProps() {
	// const { account } = useMoralis();

	// // Get the users contributions array
	// let contributionArray = [];

	// const userContributionsRef = collection(db, "users", account, "contributions");
	// const userContributionsSnap = await getDocs(userContributionsRef);

	// if (!userContributionsSnap.empty) {
	// 	contributionArray = userContributionsSnap.docs.map((doc) => ({
	// 		id: doc.id,
	// 		...doc.data(),
	// 	}));
	// }

	// Get the 'proposals' array

	// const docRef = collection(db, "proposals", account);
	// const docSnap = await getDocs(docRef);
	let proposals: ProposalType[] = [];
	const q = query(collection(db, "proposals"), where("votingCloseTimestamp", ">", Math.floor(Date.now() / 1000)));

	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		// console.log(doc.data().votes);
		proposals.push({
			id: doc.id,
			description: doc.data().description,
			options: doc.data().options,
			projectId: doc.data().projectId,
			projectImage: doc.data().projectImage,
			projectName: doc.data().projectName,
			projectTicker: doc.data().projectTicker,
			question: doc.data().question,
			title: doc.data().title,
			...(doc.data().votes && { votes: doc.data().votes }),
			votingCloseTimestamp: doc.data().votingCloseTimestamp,
		});
	});

	return {
		props: {
			proposals,
		},
	};
}
