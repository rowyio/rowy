import React from "react";
import { CustomCellProps } from "./withCustomCell";

import { MONO_FONT } from "Theme";

export default function Percentage({ docRef }: CustomCellProps) {
  return <span style={{ fontFamily: MONO_FONT }}>{docRef.id}</span>;
}
