import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Button, Col, Container, Row } from "react-bootstrap";
import HeroCryptoContainer from "./HeroCryptoContainer";

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

interface CoinDisplay {
	icon: string;
	title: string;
	shortCut: string;
	price: string;
	subPrice: string;
	priceChange: string;
}

const imagesData = [
	{ src: "p1.svg", alt: "Partner 1" },
	{ src: "p2.svg", alt: "Partner 2" },
	{ src: "p3.svg", alt: "Partner 3" },
	{ src: "p4.svg", alt: "Partner 4" },
];

async function fetchCryptoData(): Promise<CoinDisplay[]> {
	const coinIdsToDisplay = ["1", "1027", "52", "1839"];

	// NODE_ENV'e göre API URL'ini ayarla
	const isDevelopment = process.env.NODE_ENV === "development";
	const baseUrl = isDevelopment
		? "http://localhost:3000"
		: process.env.NEXT_PUBLIC_API_BASE_URL;

	try {
		const marketResponse = await fetch(`${baseUrl}/api/coin/market?limit=50`);
		if (!marketResponse.ok) {
			const errorBody = await marketResponse.text();
			console.error(
				`Market API failed (${marketResponse.status}): ${marketResponse.statusText}`,
				errorBody
			);
			throw new Error(`Market API failed: ${marketResponse.statusText}`);
		}

		const marketJson: CoinMarket[] = await marketResponse.json();
		const relevantMarketData = marketJson.filter((coin) =>
			coinIdsToDisplay.includes(coin.id.toString())
		);
		if (relevantMarketData.length === 0) {
			return [];
		}

		const relevantCoinIds = relevantMarketData.map((coin) => coin.id).join(",");
		const infoResponse = await fetch(
			`${baseUrl}/api/coin?id=${relevantCoinIds}`
		);
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

		const filteredCoins = relevantMarketData
			.map((coin) => {
				const coinInfo = infoData[coin.id.toString()];
				if (!coinInfo) {
					console.warn(`Info data not found for coin ID: ${coin.id}`);
					return null;
				}

				const price = coin.quote?.USD?.price;
				const marketCap = coin.quote?.USD?.market_cap;
				const change24h = coin.quote?.USD?.percent_change_24h;

				if (
					price === undefined ||
					marketCap === undefined ||
					change24h === undefined
				) {
					console.warn(
						`Missing quote data for coin ID: ${coin.id}`,
						coin.quote
					);
					return null;
				}

				return {
					icon: coinInfo.logo,
					title: coinInfo.name,
					shortCut: `${coinInfo.symbol}/USD`,
					price: `USD ${price.toFixed(price >= 1 ? 2 : 6)}`,
					subPrice: `$${marketCap.toLocaleString()}`,
					priceChange: `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%`,
				};
			})
			.filter((coin): coin is CoinDisplay => coin !== null);

		return filteredCoins;
	} catch (error) {
		console.error("Error fetching crypto data on server:", error);
		return [];
	}
}

export default async function Hero() {
	const t = await getTranslations("Hero");
	const filteredCoins = await fetchCryptoData();

	return (
		<>
			<section className="bg-body-tertiary">
				<Container>
					<Row className="py-5">
						<Col>
							<h1 className="text-left display-4 fs-50 fw-bold">
								{t("title")}
							</h1>
							<p className="mb-4 text-body-tertiary text-left fs-20 fw-light">
								{t("subtitle")}
							</p>
							<Button className="mb-4 rounded-5" href="/login">
								{t("getStartedButton")}
							</Button>
							<h5 className="mb-3">{t("ourPartners")}</h5>
							<Row className="mt-3 g-4">
								{imagesData.map((image, index) => (
									<Col xs={6} sm={3} key={index}>
										<Image
											src={`/${image.src}`}
											alt={image.alt}
											width={100}
											height={50}
										/>
									</Col>
								))}
							</Row>
						</Col>
						<Col className="d-md-flex justify-content-center align-baseline d-none">
							<Image
								src="/hero-right.svg"
								alt="Hero Image"
								width={450}
								height={450}
								priority
							/>
						</Col>
					</Row>
				</Container>
			</section>

			<HeroCryptoContainer filteredCoins={filteredCoins} />
		</>
	);
}
