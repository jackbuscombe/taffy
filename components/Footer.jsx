import { useRouter } from "next/router";

function Footer() {
	const router = useRouter();

	return (
		<footer className="p-4 rounded-t-lg shadow md:px-6 md:py-8 bg-[#252d46]">
			<div className="sm:flex sm:items-center sm:justify-between">
				<a onClick={() => router.push("/")} className="flex items-center mb-4 sm:mb-0">
					<img src="/logo_color_2.png" className="mr-3 h-12" alt="Taffy Logo" />
				</a>
				<ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
					<li>
						<p onClick={() => router.push("/about")} className="cursor-pointer mr-4 hover:underline md:mr-6 ">
							About
						</p>
					</li>
					<li>
						<p onClick={() => router.push("/privacy")} className="cursor-pointer mr-4 hover:underline md:mr-6">
							Privacy Policy
						</p>
					</li>
					<li>
						<p onClick={() => router.push("/licensing")} className="cursor-pointer mr-4 hover:underline md:mr-6 ">
							Licensing
						</p>
					</li>
					<li>
						<p onClick={() => router.push("/contact")} className="cursor-pointer hover:underline">
							Contact
						</p>
					</li>
				</ul>
			</div>
			<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
				© 2022{" "}
				<a onClick={() => router.push("/")} className="hover:underline cursor-pointer">
					Taffy™
				</a>
				. All Rights Reserved.
			</span>
		</footer>
	);
}
export default Footer;
