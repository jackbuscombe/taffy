import { useRouter } from "next/router";

function Footer() {
	const router = useRouter();

	return (
		<footer className="p-4 rounded-t-lg shadow md:px-6 md:py-8 bg-[#252d46]">
			<div className="sm:flex sm:items-center sm:justify-between">
				<a href="https://flowbite.com" className="flex items-center mb-4 sm:mb-0">
					<img src="/logo_color_2.png" className="mr-3 h-12" alt="Taffy Logo" />
				</a>
				<ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
					<li>
						<a onClick={() => router.push("/about")} href="#" className="mr-4 hover:underline md:mr-6 ">
							About
						</a>
					</li>
					<li>
						<a onClick={() => router.push("/privacy")} href="#" className="mr-4 hover:underline md:mr-6">
							Privacy Policy
						</a>
					</li>
					<li>
						<a onClick={() => router.push("/licensing")} href="#" className="mr-4 hover:underline md:mr-6 ">
							Licensing
						</a>
					</li>
					<li>
						<a onClick={() => router.push("/contact")} href="#" className="hover:underline">
							Contact
						</a>
					</li>
				</ul>
			</div>
			<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
				© 2022{" "}
				<a href="#" className="hover:underline">
					Taffy™
				</a>
				. All Rights Reserved.
			</span>
		</footer>
	);
}
export default Footer;
