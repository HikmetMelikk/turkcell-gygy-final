"use client";

import DashboardNavBar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";

import { useWindowSize } from "@/hooks/useWindowSize";
import { useSidebarStore } from "@/store/sidebar-store";
import React, { useEffect } from "react";
import "./dashboard.scss";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isOpen, close } = useSidebarStore();
	const { width } = useWindowSize();
	const isMobile = width < 768;
	useEffect(() => {
		if (isMobile && isOpen) {
			document.body.classList.add("mobile-sidebar-open");
		} else {
			document.body.classList.remove("mobile-sidebar-open");
		}
		return () => {
			document.body.classList.remove("mobile-sidebar-open");
		};
	}, [isOpen, isMobile]);

	return (
		<main className="dashboard-container">
			<Sidebar />

			{isMobile && (
				<div
					className={`sidebar-backdrop ${isOpen ? "show" : ""}`}
					onClick={close}
				/>
			)}
			<section className="main-content">
				<DashboardNavBar />
				<div className="content-wrapper">{children}</div>
			</section>
		</main>
	);
}
