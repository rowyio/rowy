import { useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/core";
import { SkeletonProps } from "@material-ui/lab";

export default function FieldSkeleton(props: SkeletonProps) {
	const theme = useTheme();
	return (
		<Skeleton
			variant="rectangular"
			width="100%"
			height={56}
			animation="wave"
			style={{ borderRadius: theme.shape.borderRadius }}
			{...props}
		/>
	);
}
