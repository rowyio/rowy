import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { Stack, Box, Button, ListItem, List } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

import { FieldType, ISideDrawerFieldProps } from "@src/components/fields/types";
import { TableRow, TableRowRef } from "@src/types/table";

import AddButton from "./AddButton";
import { getPseudoColumn } from "./utils";
import {
  ArraySupportedFiledTypes,
  detectType,
  SupportedTypes,
} from "./SupportedTypes";

function ArrayFieldInput({
  onChange,
  value,
  _rowy_ref,
  index,
  onRemove,
  onSubmit,
  id,
  row,
}: {
  index: number;
  onRemove: (index: number) => void;
  onChange: (value: any) => void;
  value: any;
  onSubmit: () => void;
  _rowy_ref: TableRowRef;
  id: string;
  row: TableRow;
}) {
  const typeDetected = detectType(value);

  const Sidebar = SupportedTypes[typeDetected].Sidebar;
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={false}>
      {(provided) => (
        <ListItem
          sx={[{ padding: 0, marginBottom: "12px" }]}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
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
                    false ? theme.palette.action.disabledOpacity : 1,
                },
              ]}
            />
          </Box>
          <Stack
            width={"100%"}
            sx={
              typeDetected === FieldType.json
                ? SupportedTypes[typeDetected].sx
                : null
            }
          >
            <Sidebar
              disabled={false}
              onDirty={onChange}
              onChange={onChange}
              onSubmit={onSubmit}
              column={getPseudoColumn(typeDetected, index, value)}
              value={value}
              _rowy_ref={_rowy_ref}
              row={row}
            />
          </Stack>
          <Box
            sx={[{ position: "relative", height: "1.5rem" }]}
            onClick={() => onRemove(index)}
          >
            <DeleteIcon
              color="disabled"
              sx={[
                {
                  marginLeft: "6px",
                  ":hover": {
                    cursor: "pointer",
                    color: "error.main",
                  },
                },
              ]}
            />
          </Box>
        </ListItem>
      )}
    </Draggable>
  );
}

export default function ArraySideDrawerField({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
  _rowy_ref,
  onDirty,
  ...props
}: ISideDrawerFieldProps) {
  const handleAddNew = (fieldType: ArraySupportedFiledTypes) => {
    onChange([...(value || []), SupportedTypes[fieldType].initialValue]);
    if (onDirty) onDirty(true);
  };
  const handleChange = (newValue_: any, indexUpdated: number) => {
    onChange(
      [...(value || [])].map((v: any, i) => {
        if (i === indexUpdated) {
          return newValue_;
        }

        return v;
      })
    );
  };

  const handleRemove = (index: number) => {
    value.splice(index, 1);
    onChange([...value]);
    if (onDirty) onDirty(true);
    onSubmit();
  };

  const handleClearField = () => {
    onChange([]);
    if (onSubmit) onSubmit();
  };

  function handleOnDragEnd(result: DropResult) {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    const list = Array.from(value);
    const [removed] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, removed);
    onChange(list);
    if (onSubmit) onSubmit();
  }

  if (value === undefined || Array.isArray(value)) {
    return (
      <>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="columns_manager" direction="vertical">
            {(provided) => (
              <List
                sx={{ padding: 0 }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {(value || []).map((v: any, index: number) => (
                  <ArrayFieldInput
                    key={`index-${index}-value`}
                    id={`index-${index}-value`}
                    _rowy_ref={_rowy_ref}
                    value={v}
                    onChange={(newValue) => handleChange(newValue, index)}
                    onRemove={handleRemove}
                    index={index}
                    onSubmit={onSubmit}
                    row={props.row}
                  />
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
        {props.operator === "array-contains" ? (
          value?.length < 1 ? (
            <AddButton handleAddNew={handleAddNew} />
          ) : (
            <></>
          )
        ) : (
          <AddButton handleAddNew={handleAddNew} />
        )}
      </>
    );
  }

  return (
    <Stack>
      <Box component="pre" my="0">
        {JSON.stringify(value, null, 4)}
      </Box>
      <Button
        sx={{ mt: 1, width: "fit-content" }}
        onClick={handleClearField}
        variant="text"
        color="warning"
        startIcon={<ClearIcon />}
      >
        Clear field
      </Button>
    </Stack>
  );
}
