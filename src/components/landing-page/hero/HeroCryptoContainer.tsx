import { heroCryptoContainerLinks } from "@/utils/heroCryptoContainersLinks";
import Image from "next/image";
import { Button, Card, CardBody, Col, Container, Row } from "react-bootstrap";

interface CoinDisplay {
	icon: string;
	title: string;
	shortCut: string;
	price: string;
	subPrice: string;
	priceChange: string;
}

interface HeroCryptoContainerProps {
	filteredCoins: CoinDisplay[];
}

export default function HeroCryptoContainer({
	filteredCoins,
}: HeroCryptoContainerProps) {
	return (
		<Container className="z-2 shadow mb-5 rounded-4">
			<Row className="align-items-center py-3">
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
			<Row>
				{filteredCoins.map((data) => (
					<Col
						key={data.shortCut}
						xs={12}
						sm={6}
						md={4}
						lg={3}
						className="mb-3">
						<Card className="shadow-sm rounded-4">
							<CardBody>
								<div className="d-flex align-items-center mb-3">
									<Image
										src={data.icon}
										alt={data.title}
										width={32}
										height={32}
										className="me-2"
									/>
									<h5 className="mb-0 card-title">{data.title}</h5>
									<p className="ms-3 mb-0 text-muted small">{data.shortCut}</p>
								</div>

								<div className="my-3">
									<h4 className="fw-bold">{data.price}</h4>
								</div>

								<div className="d-flex align-items-center">
									<div className="text-muted">{data.subPrice}</div>
									<span
										className={`badge ${
											data.priceChange.startsWith("+")
												? "bg-success"
												: "bg-danger"
										} ms-3`}>
										{data.priceChange}
									</span>
								</div>
							</CardBody>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
}
