import { Stack, Button } from "@material-ui/core";
import Skeleton from "@material-ui/core/Skeleton";
import AddRowIcon from "assets/icons/AddRow";

import { TABLE_HEADER_HEIGHT } from "components/Table/TableHeader";

const ButtonSkeleton = (props) => (
  <Skeleton variant="rect" {...props} sx={{ borderRadius: 1, ...props.sx }} />
);

export default function TableHeaderSkeleton() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ pl: 2, pr: 2, pb: 1.5, height: TABLE_HEADER_HEIGHT }}
    >
      <ButtonSkeleton>
        <Button variant="contained" startIcon={<AddRowIcon />}>
          Add Row
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
      <div />
      <ButtonSkeleton style={{ width: 40, height: 32 }} />
    </Stack>
  );
}
