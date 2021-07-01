import { useTheme } from "@material-ui/core";
import { Skeleton, SkeletonProps } from "@material-ui/lab";

export default function FieldSkeleton(props: SkeletonProps) {
  const theme = useTheme();
  return (
    <Skeleton
      variant="rect"
      width="100%"
      height={56}
      animation="wave"
      style={{ borderRadius: theme.shape.borderRadius }}
      {...props}
    />
  );
}
