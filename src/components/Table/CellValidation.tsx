import { styled } from "@mui/material/styles";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from "@mui/icons-material/WarningAmber";

import StyledCell from "./Styled/StyledCell";
import RichTooltip from "@src/components/RichTooltip";

const Dot = styled("div")(({ theme }) => ({
  position: "absolute",
  right: -5,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,

  width: 12,
  height: 12,

  borderRadius: "50%",
  backgroundColor: theme.palette.error.main,

  boxShadow: `0 0 0 4px var(--background-color)`,
  "[role='row']:hover &": {
    boxShadow: `0 0 0 4px var(--row-hover-background-color)`,
  },
}));

export interface ICellValidationProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  value: any;
  required?: boolean;
  validationRegex?: string;
}

export default function CellValidation({
  value,
  required,
  validationRegex,
  children,
  ...props
}: ICellValidationProps) {
  const isInvalid = validationRegex && !new RegExp(validationRegex).test(value);
  const isMissing = required && value === undefined;

  if (isInvalid)
    return (
      <StyledCell aria-invalid="true" {...props}>
        <RichTooltip
          icon={<ErrorIcon fontSize="inherit" color="error" />}
          title="Invalid data"
          message="This row will not be saved until all the required fields contain valid data"
          placement="right"
          render={({ openTooltip }) => <Dot onClick={openTooltip} />}
        />
        {children}
      </StyledCell>
    );

  if (isMissing)
    return (
      <StyledCell aria-invalid="true" {...props}>
        <RichTooltip
          icon={<WarningIcon fontSize="inherit" color="warning" />}
          title="Required field"
          message="This row will not be saved until all the required fields contain valid data"
          placement="right"
          render={({ openTooltip }) => <Dot onClick={openTooltip} />}
        />
        {children}
      </StyledCell>
    );

  return <StyledCell {...props}>{children}</StyledCell>;
}
