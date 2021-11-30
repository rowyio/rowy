import { Fade, Stack, Button } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import AddRowIcon from "@src/assets/icons/AddRow";

import { TABLE_HEADER_HEIGHT } from "@src/components/TableHeader";

const ButtonSkeleton = (props) => (
  <Skeleton variant="rect" {...props} sx={{ borderRadius: 1, ...props.sx }} />
);

export default function TableHeaderSkeleton() {
  return (
    <Fade in timeout={1000} style={{ transitionDelay: "1s" }} unmountOnExit>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          ml: "env(safe-area-inset-left)",
          mr: "env(safe-area-inset-right)",
          pl: 2,
          pr: 2,
          pb: 1.5,
          height: TABLE_HEADER_HEIGHT,
        }}
      >
        <ButtonSkeleton>
          <Button variant="contained" startIcon={<AddRowIcon />}>
            Add row
          </Button>
        </ButtonSkeleton>

        <div />

        <ButtonSkeleton>
          <Button variant="contained" startIcon={<AddRowIcon />}>
            Hide
          </Button>
        </ButtonSkeleton>
        <ButtonSkeleton>
          <Button variant="contained" startIcon={<AddRowIcon />}>
            Filter
          </Button>
        </ButtonSkeleton>

        <div style={{ flexGrow: 1 }} />

        <ButtonSkeleton style={{ width: 40, height: 32 }} />
        <div />
        <ButtonSkeleton style={{ width: 40, height: 32 }} />
        <ButtonSkeleton style={{ width: 40, height: 32 }} />
      </Stack>
    </Fade>
  );
}
