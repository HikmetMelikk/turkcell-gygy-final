"use client";

import BottomBanner from "@/components/landing-page/bottom-banner/BottomBanner";
import Footer from "@/components/landing-page/footer/Footer";
import NavBar from "@/components/landing-page/navbar/NavBar";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<NavBar />
			{children}
			<BottomBanner />
			<Footer />
		</>
	);
}
