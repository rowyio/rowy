import { format } from "date-fns";

import { styled, Typography } from "@mui/material";
import Ansi from "ansi-to-react";

import { TIME_FORMAT } from "constants/dates";

const Root = styled("div")(({ theme }) => ({
  ...(theme.typography.caption as any),
  fontFamily: theme.typography.fontFamilyMono,
  // TODO:
  color: "#CCC",

  "& code": {
    background: "none",
    borderRadius: 0,
    padding: 0,
  },

  "& .color-info": { color: theme.palette.info.light },
  "& .color-error": { color: theme.palette.error.light },
}));

export interface IBuildLogRowProps {
  logRecord: Record<string, any>;
  index: number;
}

export default function BuildLogRow({ logRecord, index }: IBuildLogRowProps) {
  return (
    <Root>
      <Typography
        variant="inherit"
        sx={{
          float: "left",
          width: "2em",
          textAlign: "right",
          pr: 2,
        }}
      >
        {index}
      </Typography>

      <Typography
        variant="inherit"
        sx={{
          lineBreak: "anywhere",
          paddingLeft: "2em",
          whiteSpace: "break-spaces",
          userSelect: "text",
        }}
      >
        <Ansi
          className={logRecord.level === "info" ? "color-nfo" : "color-error"}
        >
          {format(logRecord.timestamp, TIME_FORMAT + ":ss")}
        </Ansi>
        {"  "}
        <Ansi>
          {logRecord.log
            .replaceAll("\\n", "\n")
            .replaceAll("\\t", "\t")
            .replaceAll("\\", "")}
        </Ansi>
      </Typography>
    </Root>
  );
}
