import { useState } from "react";
import { startCase } from "lodash-es";

import MultiSelect from "@rowy/multiselect";
import { Typography, Link } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import { IProjectSettingsChildProps } from "@src/pages/Settings/ProjectSettingsPage";
import { authOptions } from "@src/config/firebaseui";

export default function Authentication({
  publicSettings,
  updatePublicSettings,
}: IProjectSettingsChildProps) {
  const [signInOptions, setSignInOptions] = useState<
    NonNullable<typeof publicSettings["signInOptions"]>
  >(
    Array.isArray(publicSettings?.signInOptions)
      ? publicSettings.signInOptions
      : ["google"]
  );

  return (
    <>
      <MultiSelect
        label="Sign-in options"
        value={signInOptions}
        options={
          Object.keys(authOptions).map((option) => ({
            value: option,
            label: startCase(option).replace("Github", "GitHub"),
          })) as any
        }
        onChange={setSignInOptions}
        onClose={() => updatePublicSettings({ signInOptions })}
        multiple
        TextFieldProps={{ id: "signInOptions" }}
      />

      <Typography>
        Before enabling a new sign-in option, make sure it’s configured in your
        Firebase project.{" "}
        <Link
          href={`https://github.com/firebase/firebaseui-web#configuring-sign-in-providers`}
          target="_blank"
          rel="noopener"
        >
          How to configure sign-in options
          <InlineOpenInNewIcon />
        </Link>
      </Typography>
    </>
  );
}
