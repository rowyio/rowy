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
import ColorSelect, {
  SelectColorThemeOptions,
} from "@src/components/SelectColors";

export default function Settings({ onChange, config }: ISettingsProps) {
  const listEndRef: any = useRef(null);
  const options = config.options ?? [];
  const [newOption, setNewOption] = useState("");

  /* State for holding Chip Colors for Select and MultiSelect */
  const colors = config.colors ?? [];
  const [chipColors, setChipColors] = useState<{}>(
    Object.assign({}, colors) || {}
  );

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

  const handleChipColorChange = (
    index: number,
    color: SelectColorThemeOptions
  ) => {
    setChipColors((current) => ({ ...current, [index]: color }));
    onChange("colors")(Object.values(chipColors));
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
        {options?.map((option: string, index: number) => (
          <>
            <Grid
              container
              direction="row"
              key={`option-${option}`}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Grid container direction="row" alignItems="center" gap={2}>
                  <ColorSelect
                    initialValue={colors[index]}
                    handleChange={(color) =>
                      handleChipColorChange(index, color)
                    }
                  />
                  <Typography>{option}</Typography>
                </Grid>
              </Grid>
              <Grid item spacing={2}>
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
        ))}
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
            onKeyDown={(e: any) => {
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
