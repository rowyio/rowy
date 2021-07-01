import { FieldType } from "@antlerengineering/form-builder";
import _startCase from "lodash/startCase";
import { authOptions } from "firebase/firebaseui";

import { Link } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

export const projectSettingsForm = [
  {
    type: FieldType.contentHeader,
    name: "_contentHeading_signInOptions",
    label: "Authentication",
  },
  {
    type: FieldType.multiSelect,
    name: "signInOptions",
    label: "Sign-In Options",
    options: Object.keys(authOptions).map((option) => ({
      value: option,
      label: _startCase(option).replace("Github", "GitHub"),
    })),
    defaultValue: ["google"],
    required: true,
    assistiveText: (
      <>
        Before enabling a new sign-in option, make sure it’s configured in your
        Firebase project.
        <br />
        <Link
          href={`https://github.com/firebase/firebaseui-web#configuring-sign-in-providers`}
          target="_blank"
          rel="noopener"
        >
          How to configure sign-in options
          <OpenInNewIcon
            aria-label="Open in new tab"
            fontSize="small"
            style={{ verticalAlign: "bottom", marginLeft: 4 }}
          />
        </Link>
      </>
    ) as any,
  },
  {
    type: FieldType.contentHeader,
    name: "_contentHeading_cloudRun",
    label: "Cloud Run Configuration",
  },
  {
    type: FieldType.shortText,
    name: "ftBuildUrl",
    label: "Cloud Run Trigger URL",
    format: "url",
  },
];
