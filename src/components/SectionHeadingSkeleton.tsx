import { Stack, StackProps, Skeleton } from "@mui/material";

export default function SectionHeadingSkeleton({ sx, ...props }: StackProps) {
  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      {...props}
      sx={{ pb: 0.5, ...sx }}
    >
      <Skeleton width={120} />
    </Stack>
  );
}
