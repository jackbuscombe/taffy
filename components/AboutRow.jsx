import Image from "next/image";

function AboutRow({ imageLeft, image, title, subtitle, image1, data1, description1, image2, data2, description2 }) {
	return (
		<div className={`flex ${imageLeft && "flex-row-reverse"} my-6 text-gray-800 gap-24`}>
			<div className="w-1/2 space-y-8 justify-center">
				<h2 className="text-2xl font-bold">{title}</h2>
				<h3 className="font-light">{subtitle}</h3>
				<div className="grid grid-cols-2">
					<div className="col-span-1">
						<img src={image1} alt="" className="h-10 w-10 rounded-full" />
						<p className="font-bold text-gray-600">{data1}</p>
						<p className="font-light text-gray-400">{description1}</p>
					</div>
					<div className="col-span-1">
						<img src={image2} alt="" className="h-10 w-10 rounded-full" />
						<p className="font-bold text-gray-600">{data1}</p>
						<p className="font-light text-gray-400">{description1}</p>
					</div>
				</div>
			</div>
			<div className="flex w-/12 justify-center">
				<img src={image} alt="" className="w-64 h-64 rounded-full" />
			</div>
		</div>
	);
}
export default AboutRow;
