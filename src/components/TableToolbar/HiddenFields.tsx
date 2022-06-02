import { useEffect, useRef, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { isEqual } from "lodash-es";
import { colord } from "colord";

import { Box, AutocompleteProps } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import IconSlash from "@src/components/IconSlash";

import ColumnSelect, { ColumnItem } from "./ColumnSelect";
import ButtonWithStatus from "@src/components/ButtonWithStatus";

import {
  globalScope,
  userSettingsAtom,
  updateUserSettingsAtom,
} from "@src/atoms/globalScope";
import { tableScope, tableIdAtom } from "@src/atoms/tableScope";
import { formatSubTableName } from "@src/utils/table";

export default function HiddenFields() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);

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

  // const tableColumns = tableColumnsOrdered.map(({ key, name }) => ({
  //   value: key,
  //   label: name,
  // }));

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
      <ColumnItem option={option}>
        <Box
          sx={[
            { position: "relative", height: "1.5rem" },
            selected
              ? { color: "primary.main" }
              : {
                  opacity: 0,
                  ".MuiAutocomplete-option.Mui-focused &": { opacity: 0.5 },
                },
          ]}
        >
          <VisibilityIcon />
          <IconSlash
            sx={[
              {
                "& .icon-slash-mask": {
                  stroke: (theme) =>
                    colord(theme.palette.background.paper)
                      .mix("#fff", theme.palette.mode === "dark" ? 0.17 : 0)
                      .mix(
                        theme.palette.action.selected,
                        theme.palette.action.selectedOpacity
                      )
                      .alpha(1)
                      .toHslString(),
                },
              },
              selected ? { strokeDashoffset: 0 } : {},
            ]}
          />
        </Box>
      </ColumnItem>
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
      <ColumnSelect
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
        {...{ AutocompleteProps: { renderOption } }}
        label="Hidden fields"
        labelPlural="fields"
        value={hiddenFields ?? []}
        onChange={setHiddenFields}
        onClose={handleSave}
      />
    </>
  );
}
