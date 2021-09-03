import {
  useScrollTrigger,
  Paper,
  TextField,
  FilledTextFieldProps,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

export interface IFloatingSearchProps extends Partial<FilledTextFieldProps> {
  label: string;
}

export default function FloatingSearch({
  label,
  ...props
}: IFloatingSearchProps) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  return (
    <Paper
      elevation={trigger ? 8 : 1}
      sx={{
        position: "sticky",
        top: (theme) => theme.spacing(7 + 1),
        zIndex: "appBar",
      }}
    >
      <TextField
        label={label}
        placeholder={label}
        hiddenLabel
        fullWidth
        type="search"
        id="user-management-search"
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{ px: 0.5, pointerEvents: "none" }}
            >
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiInputLabel-root": {
            opacity: 0,
            mt: -5,
            mb: 2,
          },
          "& .MuiFilledInput-root": {
            boxShadow: 0,
            borderRadius: 2,
            "&::before": {
              borderRadius: 2,
              height: (theme) => (theme.shape.borderRadius as number) * 4,
            },
          },
        }}
        {...props}
      />
    </Paper>
  );
}
