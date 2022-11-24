import { useAtom } from "jotai";
import { find } from "lodash-es";
import { parseJSON } from "date-fns";

import { styled, Grid } from "@mui/material";
import Column from "@src/components/Table/Mock/Column";
import Cell from "@src/components/Table/Mock/Cell";

import { IStepProps } from ".";
import { tableScope, tableSchemaAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";

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

export default function Step3Preview({ csvData, config }: IStepProps) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  const columns = config.pairs.map(({ csvKey, columnKey }) => ({
    csvKey,
    columnKey,
    ...(tableSchema.columns?.[columnKey] ??
      find(config.newColumns, { key: columnKey }) ??
      {}),
  }));

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
          sx={{ position: "sticky", top: 0, zIndex: 1 }}
        >
          {columns.map(({ key, name, type }) => (
            <ColumnWrapper item key={key}>
              <Column label={name || ""} type={type} />
            </ColumnWrapper>
          ))}
          <Spacer item />
        </Grid>

        <Grid container wrap="nowrap" style={{ flexGrow: 1 }}>
          {columns.map(({ csvKey, name, columnKey, type }) => (
            <ColumnWrapper item key={csvKey}>
              {csvData.rows.slice(0, 50).map((row, i) => (
                <Cell
                  key={csvKey + i}
                  field={columnKey}
                  value={
                    type === FieldType.date || type === FieldType.dateTime
                      ? parseJSON(row[columnKey])
                      : row[columnKey]
                  }
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
