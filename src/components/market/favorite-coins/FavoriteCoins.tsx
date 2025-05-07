"use client";

import { useFavoriteStore } from "@/store/favoritesStore";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Info, Loader2, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

interface CoinInfo {
	id: string;
	name: string;
	symbol: string;
	logo: string;
	price: number;
}

interface FavoriteCoinsResponse {
	coins: CoinInfo[];
	favoriteIds: string[];
	isLoggedIn: boolean;
}

// Function to fetch favorite coins data
async function fetchFavoriteCoins(): Promise<FavoriteCoinsResponse> {
	// Check login status first
	const supabase = createClient();
	const { data: sessionData } = await supabase.auth.getSession();
	const isLoggedInStatus = !!sessionData.session;

	if (!isLoggedInStatus) {
		return { coins: [], favoriteIds: [], isLoggedIn: false };
	}

	// Get user's favorite coin ids
	const { data: favoriteData, error: favoriteError } = await supabase
		.from("favorites")
		.select("coin_id")
		.eq("user_id", sessionData.session?.user.id);

	if (favoriteError || !favoriteData || favoriteData.length === 0) {
		console.error("Favori coin ID'leri alınırken hata:", favoriteError);
		return { coins: [], favoriteIds: [], isLoggedIn: true };
	}

	const ids = favoriteData.map((d) => d.coin_id);

	if (ids.length === 0) {
		return { coins: [], favoriteIds: [], isLoggedIn: true };
	}

	try {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		const res = await fetch(`${baseUrl}/api/coin?id=${ids.join(",")}`, {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error(`API isteği başarısız: ${res.statusText}`);
		}

		const { data: coinData } = await res.json();

		if (!coinData) {
			return { coins: [], favoriteIds: ids, isLoggedIn: true };
		}

		const coinsFormatted = Object.entries(coinData).map(
			([id, coin]: [string, any]) => ({
				id,
				name: coin.name,
				symbol: coin.symbol,
				logo: coin.logo,
				price: coin.quote?.USD?.price ?? 0,
			})
		);

		return { coins: coinsFormatted, favoriteIds: ids, isLoggedIn: true };
	} catch (error) {
		console.error("Coin verileri alınırken hata:", error);
		return { coins: [], favoriteIds: ids, isLoggedIn: true };
	}
}

export default function FavoriteCoins() {
	const t = useTranslations("Market");
	const setFavorites = useFavoriteStore((state) => state.setFavorites);

	// Use Tanstack Query to fetch data
	const { data, isLoading, isError, error, refetch, isFetching } =
		useQuery<FavoriteCoinsResponse>({
			queryKey: ["favoriteCoins"],
			queryFn: fetchFavoriteCoins,
			staleTime: 60 * 1000, // 1 minute
		});

	// Update Zustand store with favorite ids when data changes
	useEffect(() => {
		if (data?.favoriteIds) {
			setFavorites(data.favoriteIds);
		}
	}, [data, setFavorites]);

	// Loading state
	if (isLoading) {
		return (
			<div className="d-flex align-items-center justify-content-center py-5 text-muted">
				<Loader2 className="me-2 animate-spin" size={24} />
				<span>{t("loading")}</span>
			</div>
		);
	}

	// Error state
	if (isError) {
		return (
			<div className="d-flex flex-column mt-4 alert alert-danger" role="alert">
				<div className="d-flex align-items-center mb-3">
					<Info size={24} className="flex-shrink-0 me-3" />
					<div>Hata oluştu</div>
				</div>
				<div className="mb-3 small">
					{error?.message || "Bilinmeyen bir hata oluştu"}
				</div>
				<button
					className="btn-outline-danger btn btn-sm"
					onClick={() => refetch()}
					disabled={isFetching}>
					{isFetching ? (
						<>
							<Loader2 size={16} className="me-2 animate-spin" />
							{t("loading")}
						</>
					) : (
						<>
							<RefreshCw size={16} className="me-2" />
							Yenile
						</>
					)}
				</button>
			</div>
		);
	}

	// Not logged in
	if (!data?.isLoggedIn) {
		return (
			<div
				className="d-flex align-items-center mt-4 alert alert-info"
				role="alert">
				<Info size={24} className="flex-shrink-0 me-3" />
				<div>
					{t.rich("favorites.noFavoritesLoggedOut", {
						loginLink: (chunks) => (
							<Link href="/login" className="alert-link">
								{chunks}
							</Link>
						),
					})}
				</div>
			</div>
		);
	}

	// Make sure data is defined
	if (!data) {
		return (
			<div
				className="d-flex align-items-center mt-4 alert alert-warning"
				role="alert">
				<Info size={24} className="flex-shrink-0 me-3" />
				<div>Hata oluştu</div>
			</div>
		);
	}

	// Logged in but no favorites
	if (data.coins.length === 0) {
		return (
			<div
				className="d-flex align-items-center mt-4 alert alert-info"
				role="alert">
				<Info size={24} className="flex-shrink-0 me-3" />
				<div>{t("favorites.noFavoritesLoggedIn")}</div>
			</div>
		);
	}

	// Logged in with favorites
	return (
		<div className="py-5 container">
			<div className="d-flex align-items-center justify-content-between mb-4">
				<h2>{t("favorites.title")}</h2>
				<button
					className="btn-outline-primary btn btn-sm"
					onClick={() => refetch()}
					disabled={isFetching}>
					{isFetching ? (
						<>
							<Loader2 size={16} className="me-2 animate-spin" />
							{t("loading")}
						</>
					) : (
						<>
							<RefreshCw size={16} className="me-2" />
							Yenile
						</>
					)}
				</button>
			</div>
			<div className="row">
				{data.coins.map((coin) => (
					<div key={coin.id} className="mb-4 col-6 col-md-4 col-lg-3">
						<div className="p-3 border rounded text-center">
							<img
								src={coin.logo}
								alt={coin.name}
								width={40}
								className="mb-2"
							/>
							<h5>{coin.name}</h5>
							<p className="text-muted">{coin.symbol}</p>
							<p className="fw-bold">${coin.price.toFixed(2)}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
