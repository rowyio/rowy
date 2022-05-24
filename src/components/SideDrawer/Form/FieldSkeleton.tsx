import { Skeleton, SkeletonProps } from "@mui/material";

export default function FieldSkeleton(props: SkeletonProps) {
  return (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={32}
      animation="wave"
      sx={{ borderRadius: 1 }}
      {...props}
    />
  );
}
