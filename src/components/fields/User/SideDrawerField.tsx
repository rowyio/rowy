import { useRef, useState } from "react";
import { useAtom } from "jotai";
import { Tooltip, Stack, AvatarGroup, Avatar } from "@mui/material";

import { allUsersAtom, projectScope } from "@src/atoms/projectScope";
import { fieldSx } from "@src/components/SideDrawer/utils";
import { ChevronDown } from "@src/assets/icons/ChevronDown";
import { ISideDrawerFieldProps } from "@src/components/fields/types";
import UserSelect, { UserDataType } from "./UserSelect";

export default function SideDrawerSelect({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const [open, setOpen] = useState(false);
  const [users] = useAtom(allUsersAtom, projectScope);
  const parentRef = useRef(null);

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

  return (
    <>
      <Stack
        ref={parentRef}
        onClick={() => setOpen(true)}
        direction="row"
        sx={[
          fieldSx,
          {
            alignItems: "center",
            justifyContent: userValue.length > 0 ? "space-between" : "flex-end",
            marginTop: "8px",
            marginBottom: "8px",
          },
        ]}
      >
        {userValue.length === 0 ? null : userValue.length > 1 ? (
          <AvatarGroup
            sx={{
              "& .MuiAvatar-root": { width: 20, height: 20, fontSize: 12 },
            }}
            max={20}
          >
            {userValue.map(
              (user: UserDataType) =>
                user && (
                  <Tooltip title={`${user.displayName}(${user.email})`}>
                    <Avatar alt={user.displayName} src={user.photoURL} />
                  </Tooltip>
                )
            )}
          </AvatarGroup>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Avatar
              alt="Avatar"
              src={userValue[0].photoURL}
              style={{ width: 20, height: 20 }}
            />
            <span>{userValue[0].displayName}</span>
          </div>
        )}
        <ChevronDown className="row-hover-iconButton end" />
      </Stack>
      <UserSelect
        open={open}
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        parentRef={parentRef.current}
        column={column}
        showPopoverCell={setOpen}
        disabled={disabled}
      />
    </>
  );
}
