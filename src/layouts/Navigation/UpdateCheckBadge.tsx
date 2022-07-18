import { useAtom } from "jotai";

import { Badge, BadgeProps } from "@mui/material";

import { projectScope, userRolesAtom } from "@src/atoms/projectScope";
import useUpdateCheck from "@src/hooks/useUpdateCheck";

export default function UpdateCheckBadge(props: Partial<BadgeProps>) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [latestUpdate] = useUpdateCheck();

  if (
    !userRoles.includes("ADMIN") ||
    (!latestUpdate.rowy && !latestUpdate.rowyRun)
  )
    return <>{props.children}</>;

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
