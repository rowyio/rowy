import React, { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";

import {
  Grid,
  TextField,
  List,
  MenuItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Divider,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { IConnectTableSelectProps } from ".";
import useStyles from "./styles";
import Loading from "components/Loading";

import algoliasearch from "algoliasearch/lite";

import { useFiretableContext } from "../../contexts/firetableContext";
const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID ?? "",
  process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY ?? ""
);
console.log("SEARCH CLIENT", searchClient);

export interface IPopupContentsProps
  extends Omit<IConnectTableSelectProps, "className" | "TextFieldProps"> {}

// TODO: Implement infinite scroll here
export default function PopupContents({
  value = [],
  onChange,
  collectionPath,
  config,
  multiple = true,
  row,
}: IPopupContentsProps) {
  const classes = useStyles();

  const { userClaims } = useFiretableContext();

  const algoliaIndex = useMemo(() => {
    return searchClient.initIndex(collectionPath);
  }, [collectionPath]);

  // Algolia search query
  const [query, setQuery] = useState("");
  // Algolia query response
  const [response, setResponse] = useState<any | null>(null);
  const hits: any["hits"] = response?.hits ?? [];

  const [search] = useDebouncedCallback(
    async (query: string) => {
      if (!algoliaIndex) return;
      console.log("SEARCH", query, algoliaIndex, row);

      const data = { ...userClaims, ...row };
      const filters = config.filters.replace(
        /\{\{(.*?)\}\}/g,
        (m, k) => data[k]
      );
      console.log(filters);
      const resp = await algoliaIndex.search(query, {
        filters,
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
    const { _highlightResult, ...snapshot } = hit;
    const output = {
      snapshot,
      docPath: `${collectionPath}/${snapshot.objectID}`,
    };

    if (multiple) onChange([...value, output]);
    else onChange([output]);
  };
  const deselect = (hit: any) => () => {
    if (multiple)
      onChange(value.filter(v => v.snapshot.objectID !== hit.objectID));
    else onChange([]);
  };

  const selectedValues = value?.map(item => item.snapshot.objectID);

  const clearSelection = () => onChange([]);

  return (
    <Grid container direction="column" className={classes.grid}>
      <Grid item className={classes.searchRow}>
        <TextField
          value={query}
          onChange={e => setQuery(e.target.value)}
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
          onClick={e => e.stopPropagation()}
          onKeyDown={e => e.stopPropagation()}
        />
      </Grid>

      <Grid item xs className={classes.listRow}>
        <List className={classes.list}>
          {hits.map(hit => {
            const isSelected = selectedValues.indexOf(hit.objectID) !== -1;

            return (
              <React.Fragment key={hit.objectID}>
                <MenuItem
                  dense
                  onClick={isSelected ? deselect(hit) : select(hit)}
                >
                  <ListItemIcon className={classes.checkboxContainer}>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      color="secondary"
                      className={classes.checkbox}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": `label-${hit.objectID}`,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={`label-${hit.objectID}`}
                    primary={config?.primaryKeys
                      ?.map((key: string) => hit[key])
                      .join(" ")}
                    secondary={config?.secondaryKeys
                      ?.map((key: string) => hit[key])
                      .join(" ")}
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
            justify="space-between"
            alignItems="center"
          >
            <Typography
              variant="button"
              color="textSecondary"
              className={classes.selectedNum}
            >
              {value?.length} of {response?.nbHits}
            </Typography>

            <Button
              disabled={!value || value.length === 0}
              onClick={clearSelection}
              color="primary"
              className={classes.selectAllButton}
            >
              Clear Selection
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
