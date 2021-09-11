import { useTheme } from "@mui/material";
import { Skeleton } from "@mui/material";
import { SkeletonProps } from "@mui/lab";

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
