import { useState } from "react";
import { useSnackbar } from "notistack";
import { FieldType } from "@rowy/form-builder";

import { Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const FORM_FIELD_SNIPPETS = [
  {
    label: "Text field",
    value: {
      type: FieldType.shortText,
      name: "username",
      label: "Username",
      placeholder: "foo_bar",
      required: true,
      maxCharacters: 15,
      validation: [
        ["min", 3, "Must be at least 3 characters"],
        {
          0: "notOneOf",
          1: ["admin", "administrator"],
          2: "Reserved username",
        },
      ],
    },
  },
  {
    label: "Single select",
    value: {
      type: FieldType.singleSelect,
      name: "team",
      label: "Team",
      required: true,
      options: ["Blue", "Orange"],
    },
  },
  {
    label: "Multi select",
    value: {
      type: FieldType.multiSelect,
      name: "roles",
      label: "Roles",
      required: true,
      options: ["ADMIN", "EDITOR", "VIEWER"],
    },
  },
  {
    label: "Number field",
    value: {
      type: "shortText",
      InputProps: {
        type: "number",
      },
      defaultValue: 1,
      label: "Price",
      name: "price",
    },
  },
  {
    label: "Check Box",
    value: {
      type: "checkbox",
      label: "Breakfast included",
      name: "breakfast",
    },
  },
];

export default function FormFieldSnippets() {
  const { enqueueSnackbar } = useSnackbar();
  const [snippetMenuAnchor, setSnippetMenuAnchor] = useState<any | null>(null);

  return (
    <>
      <Button
        size="small"
        endIcon={<ArrowDropDownIcon />}
        onClick={(e) => setSnippetMenuAnchor(e.currentTarget)}
        id="snippet-button"
        aria-controls="snippet-menu"
        aria-haspopup="true"
        aria-expanded={!!snippetMenuAnchor ? "true" : "false"}
      >
        Copy snippet
      </Button>
      <Menu
        id="snippet-menu"
        anchorEl={snippetMenuAnchor}
        open={!!snippetMenuAnchor}
        onClose={() => setSnippetMenuAnchor(null)}
        MenuListProps={{ "aria-labelledby": "snippet-button" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {FORM_FIELD_SNIPPETS.map((snippet) => (
          <MenuItem
            key={snippet.label}
            children={snippet.label}
            onClick={() => {
              // Write validation as nested array above, but must be converted
              // to [ { 0: …, 1: …, … } ] since Firestore doesn't support
              // nested arrays
              const sanitized: any = snippet.value;
              if (Array.isArray(snippet.value.validation))
                sanitized.validation = snippet.value.validation.reduce(
                  (a, c, i) => ({ ...a, [i]: c }),
                  {}
                );

              navigator.clipboard.writeText(
                JSON.stringify(sanitized, undefined, 2)
              );
              enqueueSnackbar("Copied to clipboard");
              setSnippetMenuAnchor(null);
            }}
          />
        ))}
      </Menu>
    </>
  );
}
