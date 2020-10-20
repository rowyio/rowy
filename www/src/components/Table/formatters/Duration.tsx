import React from "react";

import { CustomCellProps } from "./withCustomCell";
import { makeStyles, createStyles } from "@material-ui/core";

export const timeDistance = (date1, date2) => {
  let distance = Math.abs(date1 - date2);
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);
  return `${hours ? `${hours}:` : ""}${("0" + minutes).slice(-2)}:${(
    "0" + seconds
  ).slice(-2)}`;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
    },
  })
);

export default function Duration({
  rowIdx,
  column,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();
  const startDate = value?.start?.toDate();
  const endDate = value?.end?.toDate();
  if (!startDate && !endDate) {
    return <></>;
  }
  if (startDate && !endDate) {
    const now = new Date();
    const duration = timeDistance(startDate, now);

    return <>{duration}</>;
  }
  if (startDate && endDate) {
    const duration = timeDistance(endDate, startDate);

    return <>{duration}</>;
  }
  return <></>;
}
