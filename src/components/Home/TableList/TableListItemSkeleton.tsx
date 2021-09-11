import { ListItem, Skeleton } from "@mui/material";

export default function TableListItemSkeleton() {
  return (
    <ListItem disableGutters disablePadding style={{ height: 48 }}>
      <Skeleton width={160} sx={{ mx: 2, flexShrink: 0 }} />
      <Skeleton sx={{ mr: 2, flexBasis: 240, flexShrink: 1 }} />

      <Skeleton
        variant="circular"
        width={24}
        height={24}
        sx={{ ml: "auto", mr: 3, flexShrink: 0 }}
      />
      <Skeleton
        variant="circular"
        width={24}
        height={24}
        sx={{ mr: 1.5, flexShrink: 0 }}
      />
    </ListItem>
  );
}
