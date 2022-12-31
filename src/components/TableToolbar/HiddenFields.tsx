import {
  useEffect,
  useRef,
  useMemo,
  useState,
  forwardRef,
  ChangeEvent,
} from "react";
import { useAtom, useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import { colord } from "colord";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { Box, AutocompleteProps, Theme } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import IconSlash from "@src/components/IconSlash";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";

import ColumnSelect, { ColumnItem } from "@src/components/Table/ColumnSelect";
import ButtonWithStatus from "@src/components/ButtonWithStatus";

import {
  projectScope,
  userSettingsAtom,
  updateUserSettingsAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableIdAtom,
  updateColumnAtom,
} from "@src/atoms/tableScope";
import { formatSubTableName } from "@src/utils/table";

export default function HiddenFields() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const canEditColumns =
    userRoles.includes("ADMIN") || userRoles.includes("OPS");
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
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, projectScope);
  const handleSave = () => {
    // Only update if there were any changes because it’s slow to update
    if (!isEqual(hiddenFields, userDocHiddenFields) && updateUserSettings) {
      updateUserSettings({
        tables: { [formatSubTableName(tableId)]: { hiddenFields } },
      });
    }
    setOpen(false);
  };

  // disable drag if search box is not empty and user does not have permission
  const [disableDrag, setDisableDrag] = useState<boolean>(false);
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
      <Draggable
        draggableId={option.value}
        index={option.index}
        isDragDisabled={disableDrag || !canEditColumns}
      >
        {(provided) => (
          <li {...props} ref={provided.innerRef} {...provided.draggableProps}>
            <Box
              sx={[{ position: "relative", height: "1.5rem" }]}
              {...provided.dragHandleProps}
            >
              <DragIndicatorOutlinedIcon
                color="disabled"
                sx={[
                  {
                    marginRight: "6px",
                    opacity: (theme) =>
                      disableDrag || !canEditColumns
                        ? theme.palette.action.disabledOpacity
                        : 1,
                  },
                ]}
              />
            </Box>
            <ColumnItem option={option}>
              <Box
                sx={[
                  { position: "relative", height: "1.5rem" },
                  selected
                    ? { color: "primary.main" }
                    : {
                        opacity: 0,
                        ".MuiAutocomplete-option.Mui-focused &": {
                          opacity: 0.5,
                        },
                      },
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

  // updates column on drag end
  function handleOnDragEnd(result: DropResult) {
    if (!result.destination || result.destination.index === result.source.index)
      return;
    updateColumn({
      key: result.draggableId,
      config: {},
      index: result.destination.index,
    });
  }

  // checks whether to disable reordering when search filter is applied
  function checkToDisableDrag(e: ChangeEvent<HTMLInputElement>) {
    setDisableDrag(e.target.value !== "" || !canEditColumns);
  }

  const ListboxComponent = forwardRef(function ListboxComponent(
    props: React.HTMLAttributes<HTMLElement>,
    ulRef: any /*React.ForwardedRef<HTMLUListElement>*/
  ) {
    const { children, ...other } = props;

    return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="columns_manager" direction="vertical">
          {(provided) => (
            <ul
              {...other}
              {...provided.droppableProps}
              ref={(ref) => {
                provided.innerRef(ref);
                if (ulRef !== null) {
                  ulRef(ref);
                }
              }}
            >
              {props.children}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
  });

  return (
    <>
      <ButtonWithStatus
        startIcon={<VisibilityOffIcon />}
        onClick={() => {
          setOpen((o) => !o);
        }}
        active={hiddenFields.length > 0}
        ref={buttonRef}
      >
        {hiddenFields.length > 0 ? `${hiddenFields.length} hidden` : "Hide"}
      </ButtonWithStatus>
      <ColumnSelect
        TextFieldProps={{
          style: { display: "none" },
          onInput: checkToDisableDrag,
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
            ListboxComponent,
          },
        }}
        label="Hidden fields"
        labelPlural="fields"
        value={hiddenFields ?? []}
        onChange={(updates: string[]) => {
          setHiddenFields(updates);
          setDisableDrag(false);
        }}
        onClose={handleSave}
        clearText="Show all"
        selectAllText="Hide all"
        doneText="Apply"
      />
    </>
  );
}
