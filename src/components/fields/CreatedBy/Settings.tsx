import { ISettingsProps } from "../types";

import { Typography, Link } from "@mui/material";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import MultiSelect from "@rowy/multiselect";
import { DATE_TIME_FORMAT } from "constants/dates";
import { EXTERNAL_LINKS } from "constants/externalLinks";

export default function Settings({ handleChange, config }: ISettingsProps) {
  return (
    <>
      <MultiSelect
        options={[
          DATE_TIME_FORMAT,
          "yyyy/MM/dd HH:mm",
          "dd/MM/yyyy HH:mm",
          "dd/MM/yyyy hh:mm aa",
          "MM/dd/yyyy hh:mm aa",
        ]}
        itemRenderer={(option) => (
          <Typography sx={{ fontFamily: "mono" }}>{option.label}</Typography>
        )}
        label="Display format"
        multiple={false}
        freeText
        clearable={false}
        searchable={false}
        value={config.format ?? DATE_TIME_FORMAT}
        onChange={handleChange("format")}
        TextFieldProps={{
          helperText: (
            <Link
              href={EXTERNAL_LINKS.dateFormat}
              target="_blank"
              rel="noopener noreferrer"
            >
              Date format reference
              <InlineOpenInNewIcon />
            </Link>
          ),
        }}
      />
    </>
  );
}
