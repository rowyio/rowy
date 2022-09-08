import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";
import { get } from "lodash-es";
import { useAtom } from "jotai";

import {
  Button,
  Checkbox,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
  Radio,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { IConnectorSelectProps } from ".";
import useStyles from "./styles";
import Loading from "@src/components/Loading";
import { getLabel } from "@src/components/fields/Connector/utils";
import { useSnackbar } from "notistack";
import { projectScope, rowyRunAtom } from "@src/atoms/projectScope";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";
import { getTableSchemaPath } from "@src/utils/table";

export interface IPopupContentsProps
  extends Omit<IConnectorSelectProps, "className" | "TextFieldProps"> {}

// TODO: Implement infinite scroll here
export default function PopupContents({
  value = [],
  onChange,
  column,
  docRef,
}: IPopupContentsProps) {
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);

  const { enqueueSnackbar } = useSnackbar();
  // const url = config.url ;
  const { config } = column;
  const elementId = config.elementId;
  const multiple = Boolean(config.multiple);

  const { classes } = useStyles();

  // Webservice search query
  const [query, setQuery] = useState("");
  // Webservice response
  const [response, setResponse] = useState<any | null>(null);
  const [hits, setHits] = useState<any[]>([]);

  useEffect(() => {
    console.log(response);
    if (response?.success === false) {
      enqueueSnackbar(response.message, { variant: "error" });
    } else if (Array.isArray(response?.hits)) {
      setHits(response.hits);
    } else {
      setHits([]);
      //enqueueSnackbar("response is not any array", { variant: "error" });
    }
  }, [response]);
  const search = useDebouncedCallback(
    async (query: string) => {
      const resp = await rowyRun!({
        route: { method: "POST", path: "/connector" },
        body: {
          columnKey: column.key,
          query: query,
          schemaDocPath: getTableSchemaPath(tableSettings),
          rowDocPath: docRef.path,
        },
      });
      setResponse(resp);
    },
    1000,
    { leading: true }
  );

  useEffect(() => {
    search(query);
  }, [query]);

  if (!response) return <Loading />;

  const select = (hit: any) => () => {
    if (multiple) onChange([...value, hit]);
    else onChange([hit]);
  };
  const deselect = (hit: any) => () => {
    if (multiple)
      onChange(value.filter((v) => v[elementId] !== hit[elementId]));
    else onChange([]);
  };

  const selectedValues = value?.map((item) => get(item, elementId));

  const clearSelection = () => onChange([]);

  return (
    <Grid container direction="column" className={classes.grid}>
      <Grid item className={classes.searchRow}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          variant="filled"
          margin="dense"
          label="Search items"
          className={classes.noMargins}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        />
      </Grid>

      <Grid item xs className={classes.listRow}>
        <List className={classes.list}>
          {hits.map((hit) => {
            const isSelected = selectedValues.some((v) => v === hit[elementId]);
            return (
              <React.Fragment key={get(hit, elementId)}>
                <MenuItem
                  dense
                  onClick={isSelected ? deselect(hit) : select(hit)}
                  disabled={
                    !isSelected && multiple && value.length >= config.max
                  }
                >
                  <ListItemIcon className={classes.checkboxContainer}>
                    {multiple ? (
                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        color="secondary"
                        className={classes.checkbox}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": `label-${get(hit, elementId)}`,
                        }}
                      />
                    ) : (
                      <Radio
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        color="secondary"
                        className={classes.checkbox}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": `label-${get(hit, elementId)}`,
                        }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    id={`label-${get(hit, elementId)}`}
                    primary={getLabel(config, hit)}
                  />
                </MenuItem>
                <Divider className={classes.divider} />
              </React.Fragment>
            );
          })}
        </List>
      </Grid>

      {multiple && (
        <Grid item className={clsx(classes.footerRow, classes.selectedRow)}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="button"
              color="textSecondary"
              className={classes.selectedNum}
            >
              {value?.length} of {hits?.length}
            </Typography>

            <Button
              disabled={!value || value.length === 0}
              onClick={clearSelection}
              color="primary"
              className={classes.selectAllButton}
            >
              Clear selection
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
