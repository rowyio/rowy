import { useAtom } from "jotai";
import { IStepProps } from ".";

import { styled, Grid } from "@mui/material";
import Column from "@src/components/Table/Mock/Column";
import Cell from "@src/components/Table/Mock/Cell";

import { tableScope, tableRowsAtom } from "@src/atoms/tableScope";

const Spacer = styled(Grid)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
  flexShrink: 0,
}));

const ColumnWrapper = styled(Grid)(() => ({
  width: 200,
  flexShrink: 0,
  marginLeft: -1,
  "&:first-of-type": { marginLeft: 0 },
}));

export default function Step4Preview({ config }: IStepProps) {
  const [tableRows] = useAtom(tableRowsAtom, tableScope);

  return (
    <div style={{ minHeight: 300, height: "calc(100% - 80px)" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
        }}
      >
        <Grid
          container
          wrap="nowrap"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {Object.entries(config).map(([field, { name, type }]) => (
            <ColumnWrapper item>
              <Column label={name} type={type} />
            </ColumnWrapper>
          ))}
          <Spacer item />
        </Grid>

        <Grid container wrap="nowrap" style={{ flexGrow: 1 }}>
          {Object.entries(config).map(([field, { name, type }]) => (
            <ColumnWrapper item>
              {tableRows.slice(0, 20).map((row) => (
                <Cell
                  key={`${field}--${row._rowy_ref.path}`}
                  field={field}
                  value={row[field]}
                  type={type}
                  name={name}
                />
              ))}
              <Spacer item />
            </ColumnWrapper>
          ))}
          <Spacer item />
        </Grid>
      </div>
    </div>
  );
}
