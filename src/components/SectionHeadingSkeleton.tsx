import { Stack, StackProps, Skeleton } from "@material-ui/core";

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
