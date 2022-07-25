import { collection, getDocs, limit, orderBy, query, startAt } from "firebase/firestore";
import FilterBar from "../components/FilterBar";
import ProjectCard from "../components/ProjectCard";
import NftCard from "../components/NftCard";
import { db } from "../firebase";
import dateToUnix from "../hooks/dateToUnix";
import { NftType, ProjectType } from "../typings";
import Nfts from "./nfts";
import { useEffect, useState } from "react";
import unixToDateTime from "../hooks/unixToDateTime";

type ProjectsPage = {
	projects: ProjectType[];
	nfts: NftType[];
};

function Projects({ projects, nfts }: ProjectsPage) {
	const [status, setStatus] = useState("all");
	const [categories, setCategories] = useState([]);
	const [sortBy, setSortBy] = useState("time");

	useEffect(() => {
		console.log(projects);
	}, []);
	return (
		<div className="w-full flex flex-col items-center bg-[#f3f6fc] py-12">
			<div className="w-4/5 ">
				<h1 className="text-black text-4xl font-bold mb-8">Projects</h1>
				<div className="grid gap-5 grid-cols-5">
					<div className="sm:block col-span-5 sm:col-span-2 md:col-span-1">
						<FilterBar filterName="Projects" status={status} setStatus={setStatus} categories={categories} setCategories={setCategories} sortBy={sortBy} setSortBy={setSortBy} />
					</div>

					{/* Main */}
					<div className="col-span-5 sm:col-span-3 md:col-span-4">
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
							{nfts.map((nft: NftType, i: number) => (
								<NftCard key={nft.id} id={nft.id} nftUrl={nft.nftUrl} nftName={nft.name} projectName={nft.projectName} />
							))}
							{/* <NftCard id={1} nftUrl="/nft1.png" nftName="NFT Name" projectName="Project Name" /> */}
							{/* <NftCard id={1} nftUrl="/nft2.png" nftName="NFT Name" projectName="Project Name" /> */}
							{/* <NftCard id={1} nftUrl="/nft3.png" nftName="NFT Name" projectName="Project Name" /> */}
							{/* <NftCard id={1} nftUrl="/nft4.png" nftName="NFT Name" projectName="Project Name" /> */}
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
							{projects.map((project: ProjectType, i: number) => (
								<ProjectCard key={project.id} projectId={project.id} projectName={project.projectName} projectTicker={project.projectTicker} projectImage={project.projectImage} description={project.projectDescription} creatorName={project.creatorName} bannerImage={project.bannerImage} backers={project.contributionsCount} followers={project.followersCount} endDate={project.endDate} ethRaised={project.contributionsValue} ethTarget={project.target} amountStaked={project.amountStaked} nftDrop={false} />
							))}
							{/* <ProjectCard projectId={1} projectName="Project Name" bannerImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" projectImage="/face-1.png" backers={45} followers={41} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={false} /> */}
							{/* <ProjectCard projectId={1} projectName="Project Name" projectImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={435} followers={122} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} /> */}
							{/* <ProjectCard projectId={1} projectName="Project Name" projectImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={454} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} /> */}

							{/* <ProjectCard projectId={1} projectName="Project Name" projectImage="/top-1.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={451} followers={3} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={false} /> */}
							{/* <ProjectCard projectId={1} projectName="Project Name" projectImage="/top-2.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={4225} followers={355} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} /> */}
							{/* <ProjectCard projectId={1} projectName="Project Name" projectImage="/top-3.png" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." creatorName="Creator" creatorImage="/face-1.png" backers={55} followers={2} timeLeft="05:07:23:12" ethRaised={7.5} ethTarget={10} nftDrop={true} /> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Projects;

export async function getServerSideProps() {
	let projects: ProjectType[] = [];
	const projectQuery = query(collection(db, "projects"), orderBy("createdTimestamp", "desc"), limit(20));
	const projectQuerySnapshot = await getDocs(projectQuery);
	projectQuerySnapshot.forEach((doc) => {
		projects.push({
			id: doc.id,
			apy: doc.data().apy,
			amountStaked: doc.data().amountStaked,
			bannerImage: doc.data().bannerImage,
			contributions: doc.data().contributions,
			contributionsCount: doc.data().contributionsCount,
			contributionsValue: doc.data().contributionsValue,
			createdTimestamp: doc.data().createdTimestamp,
			creatorAddress: doc.data().creatorAddress,
			creatorName: doc.data().creatorName,
			discord: doc.data().discord,
			dropDates: doc.data().dropDates,
			endDate: doc.data().endDate,
			followers: doc.data().followers,
			followersCount: doc.data().followersCount,
			frequency: doc.data().frequency,
			linkedIn: doc.data().linkedIn,
			projectDescription: doc.data().projectDescription,
			projectImage: doc.data().projectImage,
			projectName: doc.data().projectName,
			projectTicker: doc.data().projectTicker,
			tags: doc.data().tags,
			target: doc.data().target,
			telegram: doc.data().telegram,
			tokenId: doc.data().tokenId,
			tokenPrice: doc.data().tokenPrice,
			twitter: doc.data().twitter,
			views: doc.data().views,
		});
	});

	let nfts: NftType[] = [];
	const nftQuery = query(collection(db, "nfts"), orderBy("createdTimestamp", "desc"), limit(20));
	const nftQuerySnapshot = await getDocs(nftQuery);
	nftQuerySnapshot.forEach((doc) => {
		nfts.push({
			id: doc.id,
			chain: doc.data().chain,
			contractAddress: doc.data().contractAddress,
			createdTimestamp: doc.data().createdTimestamp,
			creatorFees: doc.data().creatorFees,
			creatorAddress: doc.data().creatorAddress,
			creatorImage: doc.data().creatorImage,
			creatorName: doc.data().creatorName,
			description: doc.data().description,
			mintTimestamp: doc.data().mintTimestamp,
			name: doc.data().name,
			nftUrl: doc.data().nftUrl,
			price: doc.data().price,
			projectId: doc.data().projectId,
			projectName: doc.data().projectName,
			tokenId: doc.data().tokenId,
			tokenStandard: doc.data().tokenStandard,
			traits: doc.data().traits,
			views: doc.data().views,
		});
	});

	return {
		props: {
			projects,
			nfts,
		},
	};
}
