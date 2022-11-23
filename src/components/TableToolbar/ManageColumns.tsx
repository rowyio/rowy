import { useEffect, useRef, useMemo, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import { colord } from "colord";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Box, AutocompleteProps, Theme } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import IconSlash from "@src/components/IconSlash";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";

import ColumnSelect, { ColumnItem } from "@src/components/Table/ColumnSelect";
import ButtonWithStatus from "@src/components/ButtonWithStatus";

import {
  globalScope,
  userSettingsAtom,
  updateUserSettingsAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  updateColumnAtom,
} from "@src/atoms/tableScope";
import { formatSubTableName } from "@src/utils/table";

export default function ManageColumns2() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);

  const [open, setOpen] = useState(false);

  // Store local selection here
  // Initialize hiddenFields from user doc
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
  >["renderOption"] = (props, option, { selected }) => {
    const slashColor = (theme: Theme) =>
      colord(theme.palette.background.paper)
        .mix("#fff", theme.palette.mode === "dark" ? 0.16 : 0)
        .alpha(1);
    return (
      <Draggable draggableId={option.value} index={option.index}>
        {(provided) => (
          <li {...props} ref={provided.innerRef} {...provided.draggableProps}>
            <Box
              sx={[{ position: "relative", height: "1.5rem" }]}
              {...provided.dragHandleProps}
            >
              <DragIndicatorOutlinedIcon
                color="disabled"
                sx={[{ marginRight: "6px" }]}
              />
            </Box>
            <ColumnItem option={option}>
              <Box
                sx={[
                  { position: "relative", height: "1.5rem" },
                  selected
                    ? { color: "primary.main" }
                    : { color: "primary.gray", opacity: 0.6 },
                ]}
              >
                <VisibilityIcon />
                <IconSlash
                  sx={[
                    {
                      "& .icon-slash-mask": {
                        stroke: (theme) => slashColor(theme).toHslString(),
                      },
                      ".Mui-focused & .icon-slash-mask": {
                        stroke: (theme) =>
                          slashColor(theme)
                            .mix(
                              theme.palette.primary.main,
                              theme.palette.action.selectedOpacity +
                                theme.palette.action.hoverOpacity
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
        )}
      </Draggable>
    );
  };

  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    updateColumn({
      key: result.draggableId,
      config: {},
      index: result.destination.index,
    });
  }

  return (
    <>
      <ButtonWithStatus
        startIcon={<ViewColumnOutlinedIcon />}
        onClick={() => setOpen((o) => !o)}
        active={hiddenFields.length > 0}
        ref={buttonRef}
      >
        {"Columns"}
      </ButtonWithStatus>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="columns_manager" direction="vertical">
          {(provided) => (
            <>
              <ColumnSelect
                TextFieldProps={{
                  style: { display: "none" },
                  SelectProps: {
                    open,
                    MenuProps: {
                      anchorEl: buttonRef.current,
                      anchorOrigin: { vertical: "bottom", horizontal: "left" },
                      transformOrigin: { vertical: "top", horizontal: "left" },
                      sx: {
                        "& .MuiAutocomplete-listbox .MuiAutocomplete-option[aria-selected=true]":
                          {
                            backgroundColor: "transparent",
                          },
                      },
                    },
                  },
                }}
                {...{
                  AutocompleteProps: {
                    renderOption,
                    ListboxProps: {
                      ...provided.droppableProps,
                      ref: provided.innerRef,
                    },
                  },
                }}
                label="Hidden fields"
                labelPlural="fields"
                value={hiddenFields ?? []}
                onChange={setHiddenFields}
                onClose={handleSave}
                clearText="Show all"
                selectAllText="Hide all"
                doneText="Apply"
              />
              {/* <div style={{ display: 'none' }}>
                {provided.placeholder}
              </div> */}
            </>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
