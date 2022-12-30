import { ISideDrawerFieldProps } from "@src/components/fields/types";

import {
  Stack,
  Box,
  Button,
  Select,
  MenuItem,
  FormControlLabel,
  TextField,
  Switch,
  Chip,
  Badge,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";

import JSONField from "@src/components/fields/Json/SideDrawerField";
import CodeEditor from "@src/components/CodeEditor";

function ArrayFieldInput({
  onChange,
  value,
  disabled,
  id,
}: {
  onChange: (value: any) => void;
  value: any;
  disabled: boolean;
  id: string;
}) {
  switch (typeof value) {
    case "bigint":
    case "number": {
      return (
        <TextField
          onChange={(e) => onChange(+e.target.value)}
          type="number"
          placeholder="Enter value"
          disabled={disabled}
          id={id}
        />
      );
    }

    case "string": {
      return (
        <TextField
          onChange={(e) => onChange(e.target.value)}
          type="text"
          placeholder="Enter value"
          disabled={disabled}
          id={id}
        />
      );
    }

    case "boolean": {
      return (
        <Switch
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          id={id}
        />
      );
    }

    case "object": {
      return (
        <Box sx={{ overflow: "auto", width: "100%" }}>
          <CodeEditor
            defaultLanguage="json"
            value={JSON.stringify(value) || "{\n  \n}"}
            onChange={(v) => {
              try {
                if (v) onChange(JSON.parse(v));
              } catch (e) {
                console.log(`Failed to parse JSON: ${e}`);
              }
            }}
          />
        </Box>
      );
    }

    default:
      return null;
  }
}

export default function ArraySideDrawerField({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
  ...props
}: ISideDrawerFieldProps) {
  const handleNewField = () => {
    onChange([...(value || []), ""]);
    onSubmit();
  };

  const handleChange = (newValue: any, indexUpdated: number) => {
    onChange(
      [...(value || [])].map((v: any, i) => {
        if (i === indexUpdated) {
          return newValue;
        }

        return v;
      })
    );

    onSubmit();
  };

  const handleChangeType = (newType: any, indexUpdated: number) => {
    console.log(newType, indexUpdated);

    onChange(
      [...(value || [])].map((v: any, i) => {
        if (i === indexUpdated) {
          switch (newType) {
            case "boolean": {
              return true;
            }
            case "number": {
              return 0;
            }
            case "string": {
              return "";
            }
            case "object": {
              return {};
            }
          }
        }

        return v;
      })
    );

    onSubmit();
  };

  const handleClearField = () => {
    onChange([]);
    onSubmit();
  };

  if (!value || Array.isArray(value)) {
    return (
      <Stack spacing={2}>
        {(value || []).map((v: any, index: number) => {
          return (
            <Stack
              key={`array-index-${index}-field`}
              spacing={1}
              alignItems="start"
              direction="row"
            >
              <FormControlLabel
                sx={{ ml: 1 }}
                control={
                  <Select
                    size="small"
                    labelId={`index-${index}-type`}
                    id={`index-${index}-type`}
                    value={typeof v}
                    disabled={disabled}
                    sx={{ width: 100 }}
                    onChange={(e) => handleChangeType(e.target.value, index)}
                    label="Type"
                  >
                    <MenuItem value="string">String</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="object">JSON</MenuItem>
                  </Select>
                }
                label={index === 0 ? "Type" : null}
                labelPlacement="top"
              />

              <FormControlLabel
                sx={{ width: "100%", overflow: "hidden" }}
                control={
                  <ArrayFieldInput
                    value={v}
                    id={`index-${index}-value`}
                    disabled={disabled}
                    onChange={(newValue) => handleChange(newValue, index)}
                  />
                }
                label={index === 0 ? "Value" : null}
                labelPlacement="top"
              />
            </Stack>
          );
        })}

        <Button
          sx={{ mt: 1, width: "fit-content" }}
          onClick={handleNewField}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add field
        </Button>
      </Stack>
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
