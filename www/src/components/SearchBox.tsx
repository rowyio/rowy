import React, { useState, useEffect } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import algoliasearch from "algoliasearch/lite";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";

import TextField from "@material-ui/core/TextField";

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID
    ? process.env.REACT_APP_ALGOLIA_APP_ID
    : "",
  process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
    ? process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
    : ""
);

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {},
    root: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
      minWidth: 200,
    },
    typography: {},

    searchField: {
      width: "100%",
      padding: 20,
    },
    list: {
      backgroundColor: "#fff",
      minWidth: 200,
      maxHeight: 400,
      overflowY: "scroll",
    },
  })
);
interface Props {
  searchData: {
    collection: string;
    onSubmit: Function | undefined;
    config: any;
  };
  clearSearch: Function;
}

const SearchBox = (props: Props) => {
  const { searchData, clearSearch } = props;
  const { collection, onSubmit, config } = searchData;
  const [query, setQuery] = useState("");
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
  useEffect(() => {
    if (algoliaIndex) {
      search("");
    }
  }, [algoliaIndex]);

  const search = async (query: string) => {
    if (algoliaIndex) {
      const resp = await algoliaIndex.search({ query });
      setHits(resp.hits);
    }
  };
  useEffect(() => {
    search(query);
  }, [query]);

  const open = Boolean(collection);
  const id = open ? "no-transition-popper" : undefined;
  const Hit = (hit: any) => (
    <ListItem
      button
      onClick={() => {
        let snapshot = { ...hit };
        delete snapshot._highlightResult;
        if (onSubmit) {
          onSubmit({ snapshot, docPath: `${collection}/${snapshot.objectID}` });
          clear();
        }
      }}
    >
      <ListItemText
        primary={
          config && config.primaryKeys.map((key: string) => `${hit[key]} `)
        }
        secondary={
          config && config.secondaryKeys.map((key: string) => `${hit[key]} `)
        }
      />
    </ListItem>
  );
  const clear = async () => {
    await setHits([]);
    await setQuery("");
    clearSearch();
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={() => {
        clear();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper className={classes.paper}>
          <TextField
            className={classes.searchField}
            placeholder="type to start searching"
            autoFocus
            value={query}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setQuery(e.target.value);
            }}
          />
          {/* results for {query} */}
          <List className={classes.list}>
            {hits.map((hit: any) => Hit(hit))}
          </List>
        </Paper>
      </Fade>
    </Modal>
  );
};
export default SearchBox;
