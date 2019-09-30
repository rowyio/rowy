import React, { useState, useEffect, useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import algoliasearch from "algoliasearch/lite";
import Paper from "@material-ui/core/Paper";

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID
    ? process.env.REACT_APP_ALGOLIA_APP_ID
    : "",
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
    ? process.env.REACT_APP_ALGOLIA_SEARCH_KEY
    : ""
);

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
      minWidth: 200,
    },
    typography: {},
    textArea: {
      fontSize: 14,
      minWidth: 230,
    },
    list: { backgroundColor: "#fff", minWidth: 200 },
  })
);
interface Props {
  searchData: {
    query: string;
    collection: string;
    anchorEl: any;
    onSubmit: Function | undefined;
  };
  clearSearch: Function;
}

const SearchBox = (props: Props) => {
  const { searchData, clearSearch } = props;
  const { query, collection, anchorEl, onSubmit } = searchData;
  const classes = useStyles();

  const [hits, setHits] = useState<any[]>([]);
  const [algoliaIndex, setAlgoliaIndex] = useState<
    algoliasearch.Index | undefined
  >(undefined);
  useEffect(() => {
    if (collection) {
      setAlgoliaIndex(searchClient.initIndex(collection));
    }
  }, [collection]);

  const search = async (query: string) => {
    if (algoliaIndex) {
      const resp = await algoliaIndex.search({ query });
      setHits(resp.hits);
    }
  };
  useEffect(() => {
    search(query);
  }, [query]);

  const open = Boolean(anchorEl);
  const id = open ? "no-transition-popper" : undefined;
  const onClickAway = (event: any) => {};
  const Hit = (hit: any) => (
    <ListItem
      button
      onClick={() => {
        let snapshot = { ...hit };
        delete snapshot._highlightResult;
        if (onSubmit)
          onSubmit({ snapshot, docPath: `${collection}/${snapshot.objectID}` });
        clearSearch();
      }}
    >
      <ListItemText primary={hit.firstName} secondary={hit.lastName} />
    </ListItem>
  );

  if (anchorEl)
    return (
      <div className={classes.root}>
        <ClickAwayListener onClickAway={onClickAway}>
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <Paper>
              results for {query}
              <List>{hits.map((hit: any) => Hit(hit))}</List>
            </Paper>
          </Popper>
        </ClickAwayListener>
      </div>
    );
  else return <div />;
};

export default SearchBox;
