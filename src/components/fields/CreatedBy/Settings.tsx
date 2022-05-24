import { ISettingsProps } from "@src/components/fields/types";

import { Typography, Link } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import MultiSelect from "@rowy/multiselect";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export default function Settings({ onChange, config }: ISettingsProps) {
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
        onChange={onChange("format")}
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
