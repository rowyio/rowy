import {
  Skeleton,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Stack,
} from "@mui/material";

export default function UserSkeleton() {
  return (
    <ListItem
      children={
        <>
          <ListItemAvatar>
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton width={80} />}
            secondary={<Skeleton width={120} />}
          />
        </>
      }
      secondaryAction={
        <Stack
          spacing={2}
          alignItems="center"
          direction="row"
          sx={{ pr: 1.25 }}
        >
          <Skeleton width={80} height={32} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Stack>
      }
    />
  );
}
