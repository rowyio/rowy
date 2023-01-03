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
          [
            tableSettingsAtom,
            {
              ...tableSettings,
              id: "preview-table",
              collection: "preview-collection",
            },
          ],
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

            // tableToolbar
            "& > div:first-child > *:not(:first-child)": {
              display: "none",
            },
            // table grid
            "& > div:nth-child(2)": {
              height: "unset",
            },
            // emtpy state
            "& .empty-state": {
              display: "none",
            },
            // column actions - add column
            '& [data-col-id="_rowy_column_actions"]': {
              padding: 0,
              width: 0,
            },
            '& [data-col-id="_rowy_column_actions"] > button': {
              display: "none",
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
