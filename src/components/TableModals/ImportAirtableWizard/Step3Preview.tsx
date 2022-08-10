import { useAtom } from "jotai";
import { find } from "lodash-es";
import { parseISO } from "date-fns";

import { styled, Grid } from "@mui/material";
import Column from "@src/components/Table/Column";
import Cell from "@src/components/Table/Cell";

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

export default function Step3Preview({ airtableData, config }: IStepProps) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  const columns = config.pairs.map(({ fieldKey, columnKey }) => ({
    fieldKey,
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
          {columns.map(({ fieldKey, name, columnKey, type }) => (
            <ColumnWrapper item key={fieldKey}>
              {airtableData.records.map((record, i) => (
                <Cell
                  key={fieldKey + i}
                  field={columnKey}
                  value={
                    type === FieldType.date || type === FieldType.dateTime
                      ? parseISO(record.fields[fieldKey])
                      : record.fields[fieldKey]
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
