import { Fade, Stack, Skeleton, Button } from "@mui/material";
import AddColumnIcon from "@src/assets/icons/AddColumn";

const NUM_CELLS = 5;

export default function HeaderRowSkeleton() {
  return (
    <Fade in timeout={1000} style={{ transitionDelay: "1s" }} unmountOnExit>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          marginLeft: (theme) =>
            `max(env(safe-area-inset-left), ${theme.spacing(2)})`,
          marginRight: `env(safe-area-inset-right)`,
        }}
      >
        {new Array(NUM_CELLS + 1).fill(undefined).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            sx={{
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              borderLeftWidth: i === 0 ? 1 : 0,
              width: i === NUM_CELLS ? 46 : 150,
              height: 42,
              borderRadius: i === NUM_CELLS ? 1 : 0,
              borderTopLeftRadius:
                i === 0 ? (theme) => theme.shape.borderRadius : 0,
              borderBottomLeftRadius:
                i === 0 ? (theme) => theme.shape.borderRadius : 0,
            }}
          />
        ))}

        <Skeleton
          sx={{ transform: "none", ml: (-46 + 6) / 8, borderRadius: 1 }}
        >
          <Button variant="contained" startIcon={<AddColumnIcon />}>
            Add column
          </Button>
        </Skeleton>
      </Stack>
    </Fade>
  );
}
