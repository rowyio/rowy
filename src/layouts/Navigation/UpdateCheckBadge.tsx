import { Badge, BadgeProps } from "@mui/material";
import useUpdateCheck from "@src/hooks/useUpdateCheck";

export default function UpdateCheckBadge(props: Partial<BadgeProps>) {
  const [latestUpdate] = useUpdateCheck();

  if (!latestUpdate.rowy && !latestUpdate.rowyRun) return <>{props.children}</>;

  return (
    <Badge
      badgeContent=" "
      color="error"
      variant="dot"
      aria-label="Update available"
      {...props}
      sx={{
        "& .MuiBadge-badge": { bgcolor: "#f00" },
        ...props.sx,
      }}
    />
  );
}
