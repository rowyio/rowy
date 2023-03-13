import { Provider, useAtom } from "jotai";

import { currentUserAtom } from "@src/atoms/projectScope";
import {
  tableRowsDbAtom,
  tableScope,
  tableSettingsAtom,
} from "@src/atoms/tableScope";

import TablePage from "@src/pages/Table/TablePage";
import { TableSchema } from "@src/types/table";
import { Box, InputLabel } from "@mui/material";
import TableSourcePreview from "./TableSourcePreview";

const PreviewTable = ({ tableSchema }: { tableSchema: TableSchema }) => {
  const [currentUser] = useAtom(currentUserAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  return (
    <Box>
      <InputLabel>Preview table</InputLabel>
      <Provider
        key={"preview-table"}
        scope={tableScope}
        initialValues={[
          [currentUserAtom, currentUser],
          [tableSettingsAtom, tableSettings],
          [tableRowsDbAtom, []],
        ]}
      >
        <TableSourcePreview tableSchema={tableSchema} />
        <Box
          sx={{
            maxHeight: 300,
            overflow: "auto",
            marginTop: 1,
            marginLeft: 0,

            // table toolbar
            "& > div:first-child": {
              display: "none",
            },
            // table grid
            "& > div:nth-of-type(2)": {
              height: "unset",
            },
            // emtpy state
            "& .empty-state": {
              display: "none",
            },
            // column actions - add column
            '& [data-col-id="_rowy_column_actions"]': {
              display: "none",
            },
            // row headers - sort by, column settings
            '& [data-row-id="_rowy_header"] > button': {
              display: "none",
            },
            // row headers - drag handler
            '& [data-row-id="_rowy_header"] > .column-drag-handle': {
              display: "none !important",
            },
            // row headers - resize handler
            '& [data-row-id="_rowy_header"] >:last-child': {
              display: "none !important",
            },
          }}
        >
          <TablePage disableModals={true} disableSideDrawer={true} />
        </Box>
      </Provider>
    </Box>
  );
};

export default PreviewTable;
