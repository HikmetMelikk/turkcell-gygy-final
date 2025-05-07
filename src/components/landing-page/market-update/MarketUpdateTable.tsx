"use client";

import { toggleFavoriteCoin } from "@/hooks/toggleFavorites";
import useMarketData from "@/hooks/useMarketData";
import { useFavoriteStore } from "@/store/favoritesStore";
import { useThemeStore } from "@/store/themeStore";
import { createClient } from "@/utils/supabase/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Spinner, Table, Toast } from "react-bootstrap";
import styles from "./market.module.scss";
import SkeletonLoader from "./SkeletonLoader";
import TradingViewMiniChart from "./TradingViewMiniChart";

export default function MarketUpdateTable({
	t,
}: {
	t: (key: string) => string;
}) {
	const { info, market } = useMarketData();
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [loadingButton, setLoadingButton] = useState<string | null>(null);
	const router = useRouter();

	const favoriteStore = useFavoriteStore();
	const isFavorite = (coinId: string) =>
		isAuthenticated && favoriteStore.isFavorite(coinId);
	const { theme } = useThemeStore();

	useEffect(() => {
		const checkAuthStatus = async () => {
			const supabase = createClient();
			const { data } = await supabase.auth.getSession();
			setIsAuthenticated(!!data.session);

			if (!data.session) {
				favoriteStore.setFavorites([]);
			} else {
				loadUserFavorites(data.session.user.id);
			}
		};

		checkAuthStatus();

		const supabase = createClient();
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event: string, session: any) => {
				setIsAuthenticated(!!session);

				if (event === "SIGNED_OUT") {
					favoriteStore.setFavorites([]);
				} else if (event === "SIGNED_IN" && session) {
					loadUserFavorites(session.user.id);
				}
			}
		);

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, []);

	const loadUserFavorites = async (userId: string) => {
		const supabase = createClient();
		const { data } = await supabase
			.from("favorites")
			.select("coin_id")
			.eq("user_id", userId);

		if (data && data.length > 0) {
			const favoriteIds = data.map((item) => item.coin_id);
			favoriteStore.setFavorites(favoriteIds);
		}
	};

	// Verinin yüklenip yüklenmediğini kontrol et
	useEffect(() => {
		if (market && market.length > 0 && Object.keys(info).length > 0) {
			// Veriler yüklendi, kısa bir gecikmeyle loading state'i kapat (daha iyi bir kullanıcı deneyimi için)
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [market, info]);

	const handleFavoriteClick = async (coinId: string, coinName: string) => {
		if (!isAuthenticated) {
			setToastMessage("Favori ekleyebilmeniz için lütfen giriş yapınız");
			setShowToast(true);
			return;
		}

		await toggleFavoriteCoin(coinId);
		const updatedFav = isFavorite(coinId);

		setToastMessage(
			updatedFav
				? `${coinName} favorilere eklendi.`
				: `${coinName} favorilerden çıkarıldı.`
		);
		setShowToast(true);
	};

	const getToastTheme = () => {
		if (!isAuthenticated && toastMessage.includes("giriş yapınız")) {
			return "warning";
		}
		return "success";
	};

	const renderSkeletonRows = () => {
		return (
			<>
				{Array(8)
					.fill(0)
					.map((_, index) => (
						<tr key={index}>
							<td colSpan={9} className="py-3">
								<SkeletonLoader height={40} />
							</td>
						</tr>
					))}
			</>
		);
	};

	const handleTradeClick = (tvSymbol: string) => {
		setLoadingButton(tvSymbol);
		setTimeout(() => {
			router.push(`/dashboard?symbol=${encodeURIComponent(tvSymbol)}`);
		}, 800);
	};

	return (
		<>
			<Table borderless hover responsive className="text-center">
				<thead>
					<tr>
						<th></th>
						<th>#</th>
						<th colSpan={2} className="text-start">
							{t("table.col1")}
						</th>
						<th>{t("table.col2")}</th>
						<th>{t("table.col3")}</th>
						<th className="text-end">{t("table.col4")}</th>
						<th>{t("table.col5")}</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{isLoading
						? renderSkeletonRows()
						: market.map((coin, index) => {
								const coinId = coin.id.toString();
								const coinInfo = info[coinId];
								if (!coinInfo) return null;

								const price = coin.quote.USD.price.toFixed(2);
								const change = coin.quote.USD.percent_change_24h.toFixed(2);
								const marketCap = coin.quote.USD.market_cap.toLocaleString();
								const isPositive = coin.quote.USD.percent_change_24h >= 0;
								const tvSymbol = `BINANCE:${coinInfo.symbol}USDT`;

								const fav = isFavorite(coinId);

								return (
									<tr key={coin.id} className={styles.tableRow}>
										<td className="align-middle">
											<StarIcon
												size={24}
												fill={fav ? "#ffc107" : "none"}
												className="text-warning"
												style={{ cursor: "pointer" }}
												onClick={() =>
													handleFavoriteClick(coinId, coinInfo.name)
												}
											/>
										</td>
										<td className="align-middle">{index + 1}</td>
										<td colSpan={2} className="text-start align-middle">
											<div className="d-flex align-items-center">
												<Image
													src={coinInfo.logo}
													alt={coinInfo.name}
													width={24}
													height={24}
													className="me-2 rounded-circle"
												/>
												<small className="fw-bold">
													{coinInfo.name}{" "}
													<span className="text-muted">{coinInfo.symbol}</span>
												</small>
											</div>
										</td>
										<td className="align-middle">${price}</td>
										<td
											className={`align-middle ${
												isPositive ? "text-success" : "text-danger"
											}`}>
											{isPositive ? "+" : ""}
											{change}%
										</td>
										<td className="text-end align-middle">${marketCap}</td>
										<td className={`align-middle text-center ${styles.chart}`}>
											<div className="d-flex justify-content-center">
												<TradingViewMiniChart
													symbol={tvSymbol}
													width={120}
													height={50}
												/>
											</div>
										</td>
										<td className="align-middle">
											<Button
												className="rounded-pill"
												onClick={() => handleTradeClick(tvSymbol)}
												disabled={loadingButton === tvSymbol}>
												{loadingButton === tvSymbol ? (
													<>
														<Spinner
															as="span"
															animation="border"
															size="sm"
															role="status"
															aria-hidden="true"
															className="me-1"
														/>
													</>
												) : (
													<small>{t("table.trade")}</small>
												)}
											</Button>
										</td>
									</tr>
								);
						  })}
				</tbody>
			</Table>
			<Toast
				show={showToast}
				onClose={() => setShowToast(false)}
				delay={2500}
				autohide
				bg={getToastTheme()}
				className="bottom-0 z-3 position-fixed m-4 end-0">
				<Toast.Header
					closeButton={true}
					className={theme === "dark" ? "bg-dark text-light" : ""}>
					<strong className="me-auto">
						{!isAuthenticated && toastMessage.includes("giriş yapınız")
							? "Bilgi"
							: "Favoriler"}
					</strong>
					<small>{theme === "dark" ? "şimdi" : "Şimdi"}</small>
				</Toast.Header>
				<Toast.Body className={theme === "dark" ? "text-light" : ""}>
					{toastMessage}
				</Toast.Body>
			</Toast>
		</>
	);
}
