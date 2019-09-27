import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import algoliasearch from "algoliasearch/lite";
import { TextField } from "@material-ui/core";

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID
    ? process.env.REACT_APP_ALGOLIA_APP_ID
    : "",
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
    ? process.env.REACT_APP_ALGOLIA_SEARCH_KEY
    : ""
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",

      display: "flex",
      flexWrap: "wrap",
    },
    typography: {
      padding: theme.spacing(2),
    },
    textArea: {
      fontSize: 14,
      minWidth: 230,
    },
    paper: { minWidth: 200 },
  })
);
interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  collectionPath: string;
}

const DocSelect = (props: Props) => {
  const { value, row, onSubmit, collectionPath } = props;
  const [query, setQuery] = useState(value ? value : "");
  const [hits, setHits] = useState<{}>([]);
  const algoliaIndex = searchClient.initIndex(collectionPath);
  const search = async (query: string) => {
    const resp = await algoliaIndex.search({ query });
    setHits(resp.hits);
  };
  useEffect(() => {
    search(query);
  }, [query]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const classes = useStyles();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "no-transition-popper" : undefined;
  const onClickAway = (event: any) => {
    if (event.target.id !== id) {
      //  onSubmit();
      // setAnchorEl(null);
    }
  };
  return (
    <div className={classes.root}>
      <ClickAwayListener onClickAway={onClickAway}>
        <div>
          <IconButton onClick={handleClick}>
            <SearchIcon />
          </IconButton>
          {value}
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <Paper>
              <TextField
                id={id}
                placeholder={`searching ${collectionPath}`}
                onChange={(e: any) => {
                  setQuery(e.target.value);
                }}
              />

              <div>
                {/* <InstantSearch
                  indexName={collectionPath}
                  searchClient={searchClient}
                >
                  
                  <SearchBox /> */}

                {/* </InstantSearch> */}
              </div>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
};

const Hit = (props: any) => {
  return (
    <div>
      <h3>{props.hit.firstName}</h3>
      <p>{props.hit.email}</p>
    </div>
  );
};

export default DocSelect;
