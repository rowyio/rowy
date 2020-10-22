import React, { useState } from "react";

import { makeStyles, createStyles, Tooltip, Button } from "@material-ui/core";
import ImportIcon from "assets/icons/Import";

const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      padding: 0,
      minWidth: 32,
    },
  })
);

export interface IImportCSVProps {
  render?: (onClick: () => void) => React.ReactNode;
}

export default function ImportCSV({ render }: IImportCSVProps) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      {render ? (
        render(handleOpen)
      ) : (
        <Tooltip title="Import">
          <Button
            onClick={handleOpen}
            variant="contained"
            color="secondary"
            aria-label="Import"
            className={classes.button}
          >
            <ImportIcon />
          </Button>
        </Tooltip>
      )}
    </>
  );
}
