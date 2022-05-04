import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Skeleton,
} from "@mui/material";

export default function TableCardSkeleton() {
  return (
    <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent style={{ flexGrow: 1 }}>
        <Typography variant="overline">
          <Skeleton width={80} />
        </Typography>
        <Typography variant="h6" gutterBottom>
          <Skeleton width={180} />
        </Typography>
        <Typography
          color="textSecondary"
          sx={{
            minHeight: (theme) =>
              (theme.typography.body2.lineHeight as number) * 2 + "em",
          }}
        >
          <Skeleton width={120} />
        </Typography>
      </CardContent>

      <CardActions sx={{ mb: 1, mx: 1 }}>
        <Skeleton
          width={60}
          height={20}
          variant="rectangular"
          sx={{ borderRadius: 1, mr: "auto" }}
        />

        <Skeleton variant="circular" width={24} height={24} />
      </CardActions>
    </Card>
  );
}
