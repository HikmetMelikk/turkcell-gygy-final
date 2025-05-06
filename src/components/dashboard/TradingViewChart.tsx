"use client";
import { useThemeStore } from "@/store/themeStore";
import { useSearchParams } from "next/navigation";
import { JSX, useEffect, useRef } from "react";

// TypeScript için global tanımlama
declare global {
	interface Window {
		TradingView?: any;
	}
}

function TradingViewWidget(): JSX.Element {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const searchParams = useSearchParams();
	const symbol = searchParams.get("symbol") || "BITSTAMP:BTCUSD";

	const { theme } = useThemeStore();

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Her seferinde widget'ı tamamen temizle
		container.innerHTML = "";

		// Widget için doğru DOM yapısı kur
		const widgetDiv = document.createElement("div");
		widgetDiv.className = "tradingview-widget-container__widget";
		widgetDiv.style.height = "calc(100% - 32px)";
		widgetDiv.style.width = "100%";
		container.appendChild(widgetDiv);

		// TradingView widget'ini oluştur ve tema parametresini doğru ayarla
		const script = document.createElement("script");
		script.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = JSON.stringify({
			autosize: true,
			symbol: symbol,
			interval: "D",
			timezone: "Etc/UTC",
			theme: theme === "dark" ? "dark" : "light",
			style: "1",
			locale: "en",
			allow_symbol_change: true,
			support_host: "https://www.tradingview.com",
		});

		container.appendChild(script);

		return () => {
			if (container) container.innerHTML = "";
		};
	}, [symbol, theme]);

	return (
		<div
			className="tradingview-widget-container"
			ref={containerRef}
			style={{ height: "100%", width: "100%", overflow: "hidden" }}
		/>
	);
}

export default TradingViewWidget;
