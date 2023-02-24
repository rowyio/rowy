import { useMemo } from "react";
import { useAtom } from "jotai";

import MultiSelect from "@rowy/multiselect";
import {
  AutocompleteProps,
  Avatar,
  Box,
  PopoverProps,
  Stack,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { projectScope, allUsersAtom } from "@src/atoms/projectScope";
import { ColumnConfig } from "@src/types/table";

export type UserDataType = {
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
};

type UserOptionType = {
  label: string;
  value: string;
  user: UserDataType;
};

interface IUserSelectProps<T = any> {
  open?: boolean;
  value: T;
  onChange: (value: T) => void;
  onSubmit: () => void;
  parentRef?: PopoverProps["anchorEl"];
  column: ColumnConfig;
  disabled: boolean;
  showPopoverCell: (value: boolean) => void;
}

export default function UserSelect({
  open,
  value,
  onChange,
  onSubmit,
  parentRef,
  column,
  showPopoverCell,
  disabled,
}: IUserSelectProps) {
  const [users] = useAtom(allUsersAtom, projectScope);

  const options = useMemo(() => {
    let options: UserOptionType[] = [];
    let emails = new Set();
    for (const user of users) {
      if (user.user && user.user?.email) {
        if (!emails.has(user.user.email)) {
          emails.add(user.user.email);
          options.push({
            label: user.user.email,
            value: user.user.email,
            user: user.user,
          });
        }
      }
    }
    return options;
  }, [users]);

  const filterOptions = createFilterOptions({
    trim: true,
    ignoreCase: true,
    matchFrom: "start",
    stringify: (option: UserOptionType) => option.user.displayName || "",
  });

  const renderOption: AutocompleteProps<
    UserOptionType,
    false,
    false,
    false
  >["renderOption"] = (props, option) => {
    return <UserListItem user={option.user} {...props} />;
  };

  if (value === undefined || value === null) {
    value = [];
  } else if (!Array.isArray(value)) {
    value = [value.email];
  }

  return (
    <MultiSelect
      value={value}
      options={options}
      label={column.name}
      labelPlural={column.name}
      multiple={column.config?.multiple || false}
      onChange={(v: any) => {
        if (typeof v === "string") {
          v = [v];
        }
        onChange(v);
      }}
      disabled={disabled}
      clearText="Clear"
      doneText="Done"
      {...{
        AutocompleteProps: {
          renderOption,
          filterOptions,
        },
      }}
      onClose={() => {
        onSubmit();
        showPopoverCell(false);
      }}
      // itemRenderer={(option: UserOptionType) => <UserListItem user={option.user} />}
      TextFieldProps={{
        style: { display: "none" },
        SelectProps: {
          open: open === undefined ? true : open,
          MenuProps: {
            anchorEl: parentRef || null,
            anchorOrigin: { vertical: "bottom", horizontal: "center" },
            transformOrigin: { vertical: "top", horizontal: "center" },
            sx: {
              "& .MuiPaper-root": { minWidth: `${column.width}px !important` },
            },
          },
        },
      }}
    />
  );
}

const UserListItem = ({ user, ...props }: { user: UserDataType }) => {
  return (
    <li {...props}>
      <Box sx={[{ position: "relative" }]}>
        <Stack
          spacing={0.75}
          direction="row"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <Avatar
            alt="Avatar"
            src={user.photoURL}
            sx={{
              width: 20,
              height: 20,
              fontSize: "inherit",
              marginRight: "6px",
            }}
          >
            {user.displayName ? user.displayName[0] : ""}
          </Avatar>
          <span>{user.displayName}</span>
        </Stack>
      </Box>
    </li>
  );
};
