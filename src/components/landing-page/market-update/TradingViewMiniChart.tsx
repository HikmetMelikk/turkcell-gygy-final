"use client";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useRef } from "react";

interface TradingViewMiniChartProps {
	symbol: string;
	width?: number;
	height?: number;
}

// TypeScript için global tanımlama
declare global {
	interface Window {
		TradingView?: any;
	}
}

export default function TradingViewMiniChart({
	symbol = "BITSTAMP:BTCUSD",
	width = 100,
	height = 40,
}: TradingViewMiniChartProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { theme } = useThemeStore(); // toggleTheme'i kaldırdık çünkü kullanılmıyor

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Her seferinde widget'ı tamamen temizle
		container.innerHTML = "";

		// Widget için doğru DOM yapısı kur
		const widgetDiv = document.createElement("div");
		widgetDiv.className = "tradingview-widget-container__widget";
		container.appendChild(widgetDiv);

		// TradingView widget'ini oluştur ve tema parametresini doğru ayarla
		const script = document.createElement("script");
		script.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = JSON.stringify({
			symbol: symbol,
			width: width,
			height: height,
			locale: "en",
			dateRange: "12M",
			colorTheme: theme === "dark" ? "dark" : "light",
			isTransparent: false,
			autosize: false,
			chartOnly: true,
			noTimeScale: true,
		});

		container.appendChild(script);

		return () => {
			if (container) container.innerHTML = "";
		};
	}, [symbol, width, height, theme]);

	return (
		<div className="tradingview-widget-container" style={{ width, height }}>
			<div ref={containerRef} style={{ width: "100%", height: "100%" }} />
		</div>
	);
}
