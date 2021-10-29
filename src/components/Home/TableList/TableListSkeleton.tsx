import { Container, Box, Paper } from "@mui/material";

import SectionHeadingSkeleton from "@src/components/SectionHeadingSkeleton";
import TableListItemSkeleton from "./TableListItemSkeleton";

export default function TableGridSkeleton() {
  return (
    <Container component="main" sx={{ px: 1, pt: 1, pb: 7 + 3 + 3 }}>
      <Paper
        sx={{
          height: 48,
          maxWidth: (theme) => theme.breakpoints.values.sm - 48,
          width: { xs: "100%", md: "50%", lg: "100%" },
          mx: "auto",
        }}
      />

      <Box component="section" sx={{ mt: 4 }}>
        <SectionHeadingSkeleton sx={{ pl: 2, pr: 1 }} />
        <Paper>
          <TableListItemSkeleton />
          <TableListItemSkeleton />
          <TableListItemSkeleton />
        </Paper>
      </Box>
      <Box component="section" sx={{ mt: 4 }}>
        <SectionHeadingSkeleton sx={{ pl: 2, pr: 1 }} />
        <Paper>
          <TableListItemSkeleton />
          <TableListItemSkeleton />
          <TableListItemSkeleton />
        </Paper>
      </Box>
    </Container>
  );
}
