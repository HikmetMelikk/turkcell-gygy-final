import FavoritesTableContainer from "@/components/market/Favorites";
import MarketCryptoContainer, {
	MarketCoinDisplay,
} from "@/components/market/MarketCryptoContainer";
import MarketHero from "@/components/market/MarketHero";

interface CoinMarket {
	id: number;
	name: string;
	symbol: string;
	quote: {
		USD: {
			price: number;
			percent_change_1h: number;
			percent_change_7d: number;
			percent_change_24h: number;
			market_cap: number;
		};
	};
}

interface CoinInfoApiResponse {
	data: Record<
		string,
		{
			id: number;
			name: string;
			symbol: string;
			logo: string;
		}
	>;
}

async function fetchMarketPageData(
	limit: number = 4
): Promise<MarketCoinDisplay[]> {
	const baseUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

	try {
		const marketResponse = await fetch(
			`${baseUrl}/api/coin/market?limit=${limit}`
		);
		if (!marketResponse.ok) {
			const errorBody = await marketResponse.text();
			console.error(
				`Market API failed (${marketResponse.status}): ${marketResponse.statusText}`,
				errorBody
			);
			throw new Error(`Market API failed: ${marketResponse.statusText}`);
		}
		const marketJson: CoinMarket[] = await marketResponse.json();

		if (!marketJson || marketJson.length === 0) {
			return [];
		}

		const coinIds = marketJson.map((coin) => coin.id).join(",");

		const infoResponse = await fetch(`${baseUrl}/api/coin?id=${coinIds}`);
		if (!infoResponse.ok) {
			const errorBody = await infoResponse.text();
			console.error(
				`Info API failed (${infoResponse.status}): ${infoResponse.statusText}`,
				errorBody
			);
			throw new Error(`Info API failed: ${infoResponse.statusText}`);
		}
		const infoJson: CoinInfoApiResponse = await infoResponse.json();
		if (!infoJson || !infoJson.data) {
			console.error("Info API response is missing 'data' field:", infoJson);
			throw new Error("Invalid Info API response structure");
		}
		const infoData = infoJson.data;

		const processedData = marketJson
			.map((coin) => {
				const coinInfo = infoData[coin.id.toString()];
				if (!coinInfo) {
					console.warn(`Info data not found for coin ID: ${coin.id}`);
					return null;
				}

				const price = coin.quote?.USD?.price;
				const change24h = coin.quote?.USD?.percent_change_24h;

				if (price === undefined || change24h === undefined) {
					console.warn(
						`Missing quote data for coin ID: ${coin.id}`,
						coin.quote
					);
					return null;
				}

				return {
					id: coin.id,
					logo: coinInfo.logo,
					name: coinInfo.name,
					symbol: coinInfo.symbol,
					price: price,
					change: change24h,
				};
			})
			.filter((coin): coin is MarketCoinDisplay => coin !== null);

		return processedData;
	} catch (error) {
		console.error("Error fetching market page data on server:", error);
		return [];
	}
}
export default async function Market() {
	const marketData = await fetchMarketPageData(4);

	return (
		<>
			<MarketHero />

			<MarketCryptoContainer marketData={marketData} />
			<FavoritesTableContainer />
		</>
	);
}
