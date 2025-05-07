import styles from "./skeleton.module.scss";

interface SkeletonLoaderProps {
	count?: number;
	height?: number;
	width?: string | number;
	className?: string;
}

function SkeletonLoader({
	count = 1,
	height = 20,
	width = "100%",
	className = "",
}: SkeletonLoaderProps) {
	const skeletons = Array.from({ length: count }, (_, index) => (
		<div
			key={`skeleton-${index}`}
			className={`${styles.skeleton} ${className}`}
			style={{
				height: `${height}px`,
				width: typeof width === "number" ? `${width}px` : width,
			}}
			data-testid={`skeleton-item-${index}`}
		/>
	));

	return <>{skeletons}</>;
}

export default SkeletonLoader;
