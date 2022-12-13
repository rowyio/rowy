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

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useDrag, useDrop } from "react-dnd";

interface IsettingsDraggableProps {
  options: string[];
  option: string;
  index: number;
  onChange: (key: string) => (value: any) => void;
}

function DraggableSettingsCard({
  options,
  option,
  index,
  onChange,
}: IsettingsDraggableProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "SETTING_DRAG",
    item: { key: index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: "SETTING_DRAG",
    drop: ({ key }: { key: number }) => {
      const temp = options[key];
      options[key] = options[index];
      options[index] = temp;
      onChange("options")([...options]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div key={index}>
      <Grid
        ref={(ref) => {
          dragRef(ref);
          dropRef(ref);
        }}
        style={{ cursor: "move" }}
        container
        direction="row"
        key={`option-${option}`}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography>{option}</Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="Remove"
            onClick={() =>
              onChange("options")(options.filter((o: string) => o !== option))
            }
          >
            {<RemoveIcon />}
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
    </div>
  );
}

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
        <DndProvider backend={HTML5Backend}>
          {options?.map((option: string, index: number) => (
            <DraggableSettingsCard
              options={options}
              option={option}
              index={index}
              onChange={onChange}
            />
          ))}
        </DndProvider>

        {/* {options?.map((option: string) => (
          <>
            <Grid
              container
              direction="row"
              key={`option-${option}`}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
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
        ))} */}
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
