import { useState } from "react";
import { authOptions } from "firebase/firebaseui";
import _startCase from "lodash/startCase";

import MultiSelect from "@antlerengineering/multiselect";
import { Typography, Link } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import { IProjectSettingsChildProps } from "pages/Settings/ProjectSettings";

export default function Authentication({
  publicSettings,
  updatePublicSettings,
}: IProjectSettingsChildProps) {
  const [signInOptions, setSignInOptions] = useState(
    Array.isArray(publicSettings?.signInOptions)
      ? publicSettings.signInOptions
      : ["google"]
  );

  return (
    <>
      <MultiSelect
        label="Sign-In Options"
        value={signInOptions}
        options={Object.keys(authOptions).map((option) => ({
          value: option,
          label: _startCase(option).replace("Github", "GitHub"),
        }))}
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
          <OpenInNewIcon
            aria-label="Open in new tab"
            fontSize="small"
            sx={{ verticalAlign: "bottom", ml: 0.5 }}
          />
        </Link>
      </Typography>
    </>
  );
}
