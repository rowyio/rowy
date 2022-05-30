import { useEffect, useRef, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { isEqual } from "lodash-es";

import { AutocompleteProps } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import IconSlash, {
  ICON_SLASH_STROKE_DASHOFFSET,
} from "@src/components/IconSlash";

import MultiSelect from "@rowy/multiselect";
import ButtonWithStatus from "@src/components/ButtonWithStatus";
import Column from "@src/components/Table/Column";

import {
  globalScope,
  userSettingsAtom,
  updateUserSettingsAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { formatSubTableName } from "@src/utils/table";

export default function HiddenFields() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  const [open, setOpen] = useState(false);

  // Store local selection here
  // Initialise hiddenFields from user doc
  const userDocHiddenFields = useMemo(
    () =>
      userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields ?? [],
    [userSettings.tables, tableId]
  );

  const [hiddenFields, setHiddenFields] =
    useState<string[]>(userDocHiddenFields);
  useEffect(() => {
    setHiddenFields(userDocHiddenFields);
  }, [userDocHiddenFields]);

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
      <Column
        label={option.label}
        type={tableSchema.columns?.[option.value]?.type}
        secondaryItem={
          <div
            className="icon-container"
            style={selected ? { opacity: 1 } : {}}
          >
            <VisibilityIcon />
            <IconSlash style={selected ? { strokeDashoffset: 0 } : {}} />
          </div>
        }
        // active={selected}
      />
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

              sx: {
                "& .MuiAutocomplete-listbox .MuiAutocomplete-option": {
                  padding: 0,
                  paddingLeft: "0 !important",
                  borderRadius: 0,
                  marginBottom: "-1px",

                  "&::after": { content: "none" },
                  "& .icon-container": { opacity: 0 },

                  "&:hover, &.Mui-focused, &.Mui-focusVisible": {
                    position: "relative",
                    zIndex: 2,

                    "& > div": {
                      color: "text.primary",
                      borderColor: "currentColor",
                      boxShadow: (theme: any) =>
                        `0 0 0 1px ${theme.palette.text.primary} inset`,
                    },
                    "& .icon-container": { opacity: 0.5 },
                  },

                  "&:hover .icon-slash": { strokeDashoffset: 0 },
                  '&[aria-selected="true"]:hover': {
                    "& .icon-slash": {
                      strokeDashoffset:
                        ICON_SLASH_STROKE_DASHOFFSET + " !important",
                    },
                  },
                },
              },
            },
          },
        }}
        {...{ AutocompleteProps: { renderOption } }}
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
