import { IDisplayCellProps } from "@src/components/fields/types";
import { Typography } from "@mui/material";

export default function GeoPoint({ value }: IDisplayCellProps) {
  if (!value) return null;
  const { latitude, longitude } = value;

  if (latitude === undefined || longitude === undefined)
    return <>⚠️ Invalid Value</>;
  // direction
  const latDirection = latitude > 0 ? "N" : "S";
  const lat = Math.abs(latitude);
  const longDirection = longitude > 0 ? "E" : "W";
  const long = Math.abs(longitude);
  // degrees
  const latDegrees = Math.floor(lat);
  const longDegrees = Math.floor(long);
  // minutes
  const latMinutes = Math.floor((lat - latDegrees) * 60);
  const longMinutes = Math.floor((long - longDegrees) * 60);
  // seconds
  const latSeconds = Math.floor((lat - latDegrees - latMinutes / 60) * 3600);
  const longSeconds = Math.floor(
    (long - longDegrees - longMinutes / 60) * 3600
  );

  return (
    <Typography variant="inherit" component="span" sx={{ fontFamily: "mono" }}>
      {latDegrees.toString().padStart(2, "0")}°
      {latMinutes.toString().padStart(2, "0")}′
      {latSeconds.toFixed(1).toString().padStart(3, "0")}″{latDirection}{" "}
      {longDegrees.toString().padStart(2, "0")}°
      {longMinutes.toString().padStart(2, "0")}′
      {longSeconds.toFixed(1).toString().padStart(3, "0")}″{longDirection}
    </Typography>
  );
}
