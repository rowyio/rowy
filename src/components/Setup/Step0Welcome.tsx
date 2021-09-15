import { ISetupStepBodyProps } from "pages/Setup";

import { FormControlLabel, Checkbox, Typography, Link } from "@mui/material";
import OpenInNewIcon from "components/InlineOpenInNewIcon";

export default function Welcome({
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={completion.welcome}
          onChange={(e) =>
            setCompletion((c) => ({ ...c, welcome: e.target.checked }))
          }
        />
      }
      label={
        <>
          <Typography sx={{ mt: 1.25, mb: 0.5 }}>
            I agree to the terms and conditions
          </Typography>
          <Link display="block" variant="body2" color="text.secondary">
            Read the simple English version
            <OpenInNewIcon />
          </Link>
          <Link display="block" variant="body2" color="text.secondary">
            Read the full terms and conditions
            <OpenInNewIcon />
          </Link>
        </>
      }
      sx={{ pr: 1, textAlign: "left", alignItems: "flex-start", p: 0, m: 0 }}
    />
  );
}
