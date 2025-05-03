import DownloadApp from "@/components/landing-page/download-app/DownloadApp";
import Hero from "@/components/landing-page/hero/Hero";
import HowItWork from "@/components/landing-page/how-it-work/HowItWork";
import MarketUpdate from "@/components/landing-page/market-update/MarketUpdate";
import OurCustomers from "@/components/landing-page/our-customers/OurCustomers";
import WhatIsRockie from "@/components/landing-page/what-is-rockie/WhatIsRockie";

export default function Home() {
	return (
		<>
			<Hero />
			<MarketUpdate />
			<HowItWork />
			<WhatIsRockie />
			<DownloadApp />
			<OurCustomers />
		</>
	);
}
