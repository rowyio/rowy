import { IWebhookModalStepProps } from "./WebhookModal";
import _sortBy from "lodash/sortBy";

import MultiSelect from "@rowy/multiselect";
import { ListItemIcon } from "@mui/material";

import { useProjectContext } from "contexts/ProjectContext";
import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";

export default function Step2Auth({
  webhookObject,
  setWebhookObject,
}: IWebhookModalStepProps) {
  return <>provides different fields based on the webhookType</>;
}
