import { useRef, useState } from "react";
import { useAtom } from "jotai";
import { isEqual } from "lodash-es";

import { AutocompleteProps } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";

import MultiSelect from "@rowy/multiselect";
import ButtonWithStatus from "@src/components/ButtonWithStatus";
// FIXME:
// import Column from "@src/components/Wizards/Column";

import {
  globalScope,
  userSettingsAtom,
  updateUserSettingsAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { formatSubTableName } from "@src/utils/table";

export default function HiddenFields() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  const [open, setOpen] = useState(false);

  // Store local selection here
  // Initialise hiddenFields from user doc
  const userDocHiddenFields =
    userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields ?? [];
  const [hiddenFields, setHiddenFields] =
    useState<string[]>(userDocHiddenFields);

  const tableColumns = tableColumnsOrdered.map(({ key, name }) => ({
    value: key,
    label: name,
  }));

  // Save when MultiSelect closes
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, globalScope);
  const handleSave = () => {
    // Only update if there were any changes because it’s slow to update
    if (!isEqual(hiddenFields, userDocHiddenFields) && updateUserSettings) {
      updateUserSettings({
        tables: { [formatSubTableName(tableId)]: { hiddenFields } },
      });
    }
    setOpen(false);
  };
  const renderOption: AutocompleteProps<
    any,
    true,
    false,
    any
  >["renderOption"] = (props, option, { selected }) => (
    <li {...props}>
      {/* FIXME: <Column
        label={option.label}
        type={tableState.columns[option.value]?.type}
        secondaryItem={<VisibilityOffIcon className="hiddenIcon" />}
        active={selected}
      /> */}
    </li>
  );

  return (
    <>
      <ButtonWithStatus
        startIcon={<VisibilityOffIcon />}
        onClick={() => setOpen((o) => !o)}
        active={hiddenFields.length > 0}
        ref={buttonRef}
      >
        {hiddenFields.length > 0 ? `${hiddenFields.length} hidden` : "Hide"}
      </ButtonWithStatus>
      <MultiSelect
        TextFieldProps={{
          style: { display: "none" },
          SelectProps: {
            open,
            MenuProps: {
              anchorEl: buttonRef.current,
              anchorOrigin: { vertical: "bottom", horizontal: "left" },
              transformOrigin: { vertical: "top", horizontal: "left" },
            },
          },
        }}
        {...({
          AutocompleteProps: {
            renderOption,
            sx: {
              "& .MuiAutocomplete-option": {
                padding: 0,
                paddingLeft: "0 !important",
                borderRadius: 0,
                marginBottom: "-1px",

                "&::after": { content: "none" },

                "&:hover, &.Mui-focused, &.Mui-focusVisible": {
                  backgroundColor: "transparent",

                  position: "relative",
                  zIndex: 2,

                  "& > div": {
                    color: "text.primary",
                    borderColor: "currentColor",
                    boxShadow: (theme: any) =>
                      `0 0 0 1px ${theme.palette.text.primary} inset`,
                  },
                  "& .hiddenIcon": { opacity: 0.5 },
                },

                '&[aria-selected="true"], &[aria-selected="true"].Mui-focused, &[aria-selected="true"].Mui-focusVisible':
                  {
                    backgroundColor: "transparent",

                    position: "relative",
                    zIndex: 1,

                    "& .hiddenIcon": { opacity: 1 },
                  },
              },
            },
          },
        } as any)}
        label="Hidden fields"
        labelPlural="fields"
        options={tableColumns}
        value={hiddenFields ?? []}
        onChange={setHiddenFields}
        onClose={handleSave}
      />
    </>
  );
}
