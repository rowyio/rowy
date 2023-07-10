import { useState, useRef } from "react";
import { ISettingsProps } from "@src/components/fields/types";

import {
  InputLabel,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircle";
import RemoveIcon from "@mui/icons-material/CancelRounded";
import CheckIcon from "@mui/icons-material/CheckCircleRounded";
import ColorSelect, {
  SelectColorThemeOptions,
} from "@src/components/SelectColors";

import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import palette, { paletteToMui } from "@src/theme/palette";

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  backgroundColor: isDragging ? "rgba(255, 255, 255, 0.08)" : "",
  borderRadius: "4px",
  ...draggableStyle,
});

export interface IColors extends SelectColorThemeOptions {
  name: string;
}

export const getColors = (
  list: IColors[],
  option: string
): SelectColorThemeOptions => {
  const defaultColor = paletteToMui(palette.aGray);
  const key = option.toLocaleLowerCase?.().replace(" ", "_").trim();
  const color = list.find((opt: IColors) => opt.name === key);
  // Null check in return
  return color || defaultColor;
};

export default function Settings({ onChange, config }: ISettingsProps) {
  const listEndRef: any = useRef(null);
  const options = config.options ?? [];
  const [newOption, setNewOption] = useState("");
  const [editOption, setEditOption] = useState({
    oldOption: "",
    newOption: "",
  });

  /* State for holding Chip Colors for Select and MultiSelect */
  let colors = config.colors ?? [];

  const handleAdd = () => {
    if (newOption.trim() !== "") {
      if (options.includes(newOption)) {
        window.alert(`"${newOption}" is already an option`);
      } else {
        onChange("options")([...options, newOption.trim()]);
        setNewOption("");
        listEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  };

  const handleEdit = () => {
    const { oldOption, newOption: _newOption } = editOption;
    const newOption = _newOption.trim();
    if (oldOption === newOption) {
      setEditOption({
        oldOption: "",
        newOption: "",
      });
      return;
    }

    if (newOption !== "") {
      if (options.includes(newOption)) {
        window.alert(`"${newOption}" is already an option`);
      } else {
        const newOptions = options.map((option: string) =>
          option === oldOption ? newOption : option
        );
        onChange("options")(newOptions);

        handleChipColorChange("update", oldOption, undefined, newOption);

        setEditOption({
          oldOption: "",
          newOption: "",
        });
      }
    }
  };

  const handleChipColorChange = (
    type: "save" | "delete" | "update",
    key: string,
    color?: SelectColorThemeOptions,
    newKey?: string
  ) => {
    const _key = key.toLocaleLowerCase?.().replace(" ", "_").trim();
    const exists = colors.findIndex((option: IColors) => option.name === _key);

    // If saving Check if object with the `color.name` is equal to `_key` and replace value at the index of `exists`
    // Else save new value with `_key` as `color.name`
    if (type === "save") {
      if (exists !== -1) {
        colors[exists] = { name: _key, ...{ ...color } };
        onChange("colors")(colors);
      } else {
        onChange("colors")([...colors, { name: _key, ...{ ...color } }]);
      }
    }
    // If deleting Filter out object that has `color.name` equals to `_key`
    if (type === "delete") {
      const updatedColors = colors.filter(
        (option: IColors) => option.name !== _key
      );
      onChange("colors")(updatedColors);
    }

    if (type === "update" && newKey) {
      const _newKey = newKey.toLocaleLowerCase?.().replace(" ", "_").trim();
      const updatedColors = colors.map((option: IColors) =>
        option.name === _key ? { ...option, name: _newKey } : option
      );
      onChange("colors")(updatedColors);
    }
  };

  const handleItemDelete = (option: string) => {
    onChange("options")(options.filter((o: string) => o !== option));
    handleChipColorChange("delete", option);
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const [removed] = options.splice(result.source.index, 1);
    options.splice(result.destination.index, 0, removed);
    onChange("options")([...options]);
  };

  return (
    <div>
      <InputLabel>Options</InputLabel>
      <div
        style={{
          maxHeight: 180,
          overflowY: "scroll",
          overflowX: "hidden",
          marginBottom: 5,
        }}
      >
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="options_manager" direction="vertical">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {options?.map((option: string, index: number) => (
                  <Draggable key={option} draggableId={option} index={index}>
                    {(provided, snapshot) => (
                      <>
                        <Grid
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          container
                          direction="row"
                          key={`option-${option}`}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid
                            {...provided.dragHandleProps}
                            item
                            sx={{ display: "flex", flexGrow: 1 }}
                            alignItems="center"
                          >
                            <DragIndicatorOutlinedIcon
                              color="disabled"
                              sx={[
                                {
                                  marginRight: "6px",
                                },
                              ]}
                            />
                            <Grid
                              container
                              direction="row"
                              alignItems="center"
                              gap={2}
                              sx={{ flexGrow: 1 }}
                            >
                              <ColorSelect
                                key={option}
                                initialValue={getColors(colors, option)}
                                handleChange={(color) =>
                                  handleChipColorChange("save", option, color)
                                }
                              />

                              {editOption.oldOption === option ? (
                                <Grid
                                  sx={{ display: "flex", flexGrow: 1 }}
                                  alignItems="center"
                                >
                                  <TextField
                                    onChange={(e) =>
                                      setEditOption({
                                        oldOption: option,
                                        newOption: e.target.value,
                                      })
                                    }
                                    value={editOption.newOption}
                                    sx={{ flexGrow: 1 }}
                                    autoFocus
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        handleEdit();
                                      }
                                    }}
                                    onBlur={handleEdit}
                                  />
                                  <IconButton
                                    aria-label="Save"
                                    onClick={handleEdit}
                                  >
                                    {<CheckIcon />}
                                  </IconButton>
                                </Grid>
                              ) : (
                                <Typography
                                  onClick={() => {
                                    // While editing a field, if the user clicks on some other field
                                    // This makes sure that the previous edit is saved
                                    handleEdit();

                                    setEditOption({
                                      oldOption: option,
                                      newOption: option,
                                    });
                                  }}
                                  sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                  {option}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                          <Grid item>
                            <IconButton
                              aria-label="Remove"
                              onClick={() => handleItemDelete(option)}
                            >
                              {<RemoveIcon />}
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Divider />
                      </>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div ref={listEndRef} style={{ height: 40 }} />
      </div>

      <Grid container direction="row" alignItems="center">
        <Grid item>
          <IconButton
            aria-label="Add new"
            onClick={() => {
              handleAdd();
            }}
          >
            {<AddIcon />}
          </IconButton>
        </Grid>
        <Grid item xs={10} md={11}>
          <TextField
            value={newOption}
            fullWidth
            label="New option"
            id="new-option"
            onChange={(e) => {
              setNewOption(e.target.value);
            }}
            onKeyPress={(e: any) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
            helperText=" "
          />
        </Grid>
      </Grid>

      <FormControlLabel
        control={
          <Checkbox
            checked={config.freeText}
            onChange={(e) => onChange("freeText")(e.target.checked)}
          />
        }
        label={
          <>
            Users can add custom options
            <FormHelperText>
              Custom options will only appear in the row it was added to. They
              will not appear in the list of options above.
            </FormHelperText>
          </>
        }
        style={{ marginLeft: -10 }}
      />
    </div>
  );
}
