import { CircularProgress, CircularProgressProps } from "@mui/material";

export interface ICircularProgressOpticalProps extends CircularProgressProps {
  size?: number;
}

export default function CircularProgressOptical({
  size = 40,
  ...props
}: ICircularProgressOpticalProps) {
  const DEFAULT_SIZE = 40;
  const DEFAULT_THICKNESS = 3.6;
  const linearThickness = (DEFAULT_SIZE / size) * DEFAULT_THICKNESS;
  const opticalRatio = 1 - (1 - size / DEFAULT_SIZE) / 2;

  return (
    <CircularProgress
      {...props}
      size={size}
      thickness={linearThickness * opticalRatio}
    />
  );
}
