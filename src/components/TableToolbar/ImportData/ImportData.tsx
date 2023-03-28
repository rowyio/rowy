import { useState, useRef } from "react";
import { useAtom } from "jotai";

import {
  Popover,
  PopoverProps as MuiPopoverProps,
  Divider,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { Import as ImportIcon } from "@src/assets/icons";

import { projectScope, userRolesAtom } from "@src/atoms/projectScope";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";
import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import ImportFromCsv from "@src/components/TableToolbar/ImportData/ImportFromCsv";
import ImportFromAirtable from "@src/components/TableToolbar/ImportData/ImportFromAirtable";

export interface IImportDataProps {
  render?: (
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  ) => React.ReactNode;
  PopoverProps?: Partial<MuiPopoverProps>;
}

export enum ImportMethod {
  csv = "csv",
  airtable = "airtable",
}

export default function ImportData({ render, PopoverProps }: IImportDataProps) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);

  const importMethodRef = useRef(ImportMethod.csv);
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [tab, setTab] = useState("csv");
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setOpen(event.currentTarget);

  const handleClose = () => {
    setOpen(null);
    setTab("csv");
  };
  const popoverId = open ? "import-popover" : undefined;

  if (tableSettings.readOnly && !userRoles.includes("ADMIN")) return null;

  return (
    <>
      {render ? (
        render(handleOpen)
      ) : (
        <TableToolbarButton
          title="Import data"
          onClick={handleOpen}
          icon={<ImportIcon />}
        />
      )}

      <Popover
        id={popoverId}
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...PopoverProps}
        sx={{
          "& .MuiTabPanel-root": {
            width: 500,
          },
        }}
      >
        <TabContext value={tab}>
          <TabList
            onChange={(_, v) => setTab(v)}
            aria-label="Import data method tabs"
            action={(actions) =>
              setTimeout(() => actions?.updateIndicator(), 200)
            }
            variant="fullWidth"
          >
            <Tab
              label="CSV/TSV/JSON"
              value="csv"
              onClick={() => (importMethodRef.current = ImportMethod.csv)}
            />
            <Tab
              label="Airtable"
              value="airtable"
              onClick={() => (importMethodRef.current = ImportMethod.airtable)}
            />
          </TabList>
          <Divider style={{ marginTop: -1 }} />

          <TabPanel value="csv" id="import-csv-tab" sx={{ padding: 0 }}>
            <ImportFromCsv />
          </TabPanel>

          <TabPanel value="airtable" id="import-airtable-tab" sx={{ pb: 0 }}>
            <ImportFromAirtable />
          </TabPanel>
        </TabContext>
      </Popover>
    </>
  );
}
