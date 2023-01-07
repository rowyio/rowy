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

import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  backgroundColor: isDragging ? "rgba(255, 255, 255, 0.08)" : "",
  borderRadius: "4px",
  ...draggableStyle,
});

export default function Settings({ onChange, config }: ISettingsProps) {
  const listEndRef: any = useRef(null);
  const options = config.options ?? [];
  const [newOption, setNewOption] = useState("");
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
                            sx={{ display: "flex" }}
                          >
                            <DragIndicatorOutlinedIcon
                              color="disabled"
                              sx={[
                                {
                                  marginRight: "6px",
                                },
                              ]}
                            />
                            <Typography>{option}</Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              aria-label="Remove"
                              onClick={() =>
                                onChange("options")(
                                  options.filter((o: string) => o !== option)
                                )
                              }
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
