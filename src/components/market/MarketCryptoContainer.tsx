import { heroCryptoContainerLinks } from "@/utils/heroCryptoContainersLinks";
import Image from "next/image";
import {
	Badge,
	Button,
	Card,
	CardBody,
	Col,
	Container,
	Row,
} from "react-bootstrap";
import TradingViewMiniChart from "../landing-page/market-update/TradingViewMiniChart";

export interface MarketCoinDisplay {
	id: number;
	logo: string;
	name: string;
	symbol: string;
	price: number;
	change: number;
}
interface MarketCryptoContainerProps {
	marketData: MarketCoinDisplay[];
}
export default function MarketCryptoContainer({
	marketData,
}: MarketCryptoContainerProps) {
	return (
		<Container className="shadow mb-5 rounded-4">
			<Row className="align-items-center py-3 border-bottom">
				{heroCryptoContainerLinks.map((crypto, index) => (
					<Col
						key={index}
						xs={4}
						sm={4}
						md={3}
						lg={2}
						xl="auto"
						className="mb-3 mb-xl-0 text-center">
						<div className="d-flex align-items-center justify-content-center">
							{index === 0 ? (
								<Button
									href={`#${crypto.toLowerCase()}`}
									className="rounded-5 text-white fw-medium">
									{crypto}
								</Button>
							) : (
								<a
									href={`#${crypto.toLowerCase()}`}
									className="text-dark text-decoration-none fw-medium">
									{crypto}
								</a>
							)}
						</div>
					</Col>
				))}
			</Row>
			<Row className="py-4">
				{marketData.map((coin) => {
					return (
						<Col key={coin.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
							<Card className="shadow-sm rounded-4 h-100">
								<CardBody className="d-flex flex-column">
									<div className="d-flex align-items-center justify-content-between mb-3">
										<Col className="d-flex flex-column">
											<Image
												src={coin.logo}
												alt={coin.name}
												width={40}
												height={40}
												className="mb-3 img-fluid"
											/>
											<small>{coin.symbol}</small>
										</Col>
										<Col className="d-flex flex-column align-items-end">
											<TradingViewMiniChart
												symbol={`BINANCE:${coin.symbol}USDT`}
											/>
											<Badge
												className={`rounded-pill ${
													coin.change >= 0 ? "bg-success" : "bg-danger"
												}`}>
												{coin.change.toFixed(2)}%
											</Badge>
										</Col>
									</div>

									<div className="d-flex align-items-center mt-auto text-center">
										<h4 className="me-2 mb-0 fw-medium">
											USD{" "}
											{coin.price.toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 6,
											})}
										</h4>
										<p className="mb-0 text-muted">{coin.symbol}</p>{" "}
									</div>
								</CardBody>
							</Card>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
}
