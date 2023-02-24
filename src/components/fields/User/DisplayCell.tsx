import { useAtom } from "jotai";
import { Avatar, AvatarGroup, ButtonBase, Stack, Tooltip } from "@mui/material";
import { allUsersAtom, projectScope } from "@src/atoms/projectScope";
import { IDisplayCellProps } from "@src/components/fields/types";
import { ChevronDown } from "@src/assets/icons/ChevronDown";
import { UserDataType } from "./UserSelect";

export default function User({
  value,
  showPopoverCell,
  disabled,
  tabIndex,
}: IDisplayCellProps) {
  const [users] = useAtom(allUsersAtom, projectScope);

  let userValue: UserDataType[] = [];
  let emails = new Set();

  if (value !== undefined && value !== null) {
    if (!Array.isArray(value)) {
      value = [value.email];
    }
    for (const user of users) {
      if (user.user && user.user?.email && value.includes(user.user.email)) {
        if (!emails.has(user.user.email)) {
          emails.add(user.user.email);
          userValue.push(user.user);
        }
      }
    }
  }

  if (userValue.length === 0) {
    return (
      <ButtonBase
        onClick={() => showPopoverCell(true)}
        style={{
          width: "100%",
          height: "100%",
          font: "inherit",
          color: "inherit !important",
          letterSpacing: "inherit",
          textAlign: "inherit",
          justifyContent: "flex-end",
        }}
        tabIndex={tabIndex}
      >
        <ChevronDown className="row-hover-iconButton end" />
      </ButtonBase>
    );
  }

  const rendered = (
    <Stack
      spacing={0.75}
      direction="row"
      alignItems="center"
      style={{
        flexGrow: 1,
        overflow: "hidden",
        paddingLeft: "var(--cell-padding)",
      }}
    >
      {userValue.length > 1 ? (
        <AvatarGroup
          sx={{
            "& .MuiAvatar-root": { width: 20, height: 20, fontSize: 12 },
          }}
          max={5}
        >
          {userValue.map((user: UserDataType) => (
            <Tooltip title={`${user.displayName}(${user.email})`}>
              <Avatar alt={user.displayName} src={user.photoURL} />
            </Tooltip>
          ))}
        </AvatarGroup>
      ) : (
        <>
          <Avatar
            alt="Avatar"
            src={userValue[0].photoURL}
            style={{ width: 20, height: 20 }}
          />
          <span>{userValue[0].displayName}</span>
        </>
      )}
    </Stack>
  );

  if (disabled) {
    return rendered;
  }
  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      style={{
        width: "100%",
        height: "100%",
        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
      tabIndex={tabIndex}
    >
      {rendered}
      <ChevronDown className="row-hover-iconButton end" />
    </ButtonBase>
  );
}
