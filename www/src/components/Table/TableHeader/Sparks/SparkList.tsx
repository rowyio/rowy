import {
  Box,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  parseSparkConfig,
  serialiseSpark,
  sparkTypes,
  ISpark,
  ISparkType,
} from "./utils";
import EmptyState from "components/EmptyState";
import AddIcon from "@material-ui/icons/Add";
import EmptyIcon from "@material-ui/icons/AddBox";
import { useRef } from "react";

const useStyles = makeStyles((theme) => ({
  hoverableEmptyState: {
    borderRadius: theme.spacing(1),
    cursor: "pointer",
    padding: theme.spacing(2),
    "&:hover": {
      background: theme.palette.background.paper,
    },
  },
}));

export interface ISparkListProps {
  sparks: ISpark[];
  handleAddSpark: (type: ISparkType) => void;
}

export default function SparkList({ sparks, handleAddSpark }: ISparkListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const addButtonRef = useRef(null);
  const classes = useStyles();

  const activeSparkCount = sparks.filter((spark) => spark.active).length;

  const handleAddButton = () => {
    setAnchorEl(addButtonRef.current);
  };

  const handleChooseAddType = (type: ISparkType) => {
    handleClose();
    handleAddSpark(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop={"0px !important"}
      >
        <Typography variant="overline">
          SPARKS ({activeSparkCount}/{sparks.length})
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddButton}
          ref={addButtonRef}
        >
          ADD SPARK
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {sparkTypes.map((type) => (
            <MenuItem
              onClick={() => {
                handleChooseAddType(type);
              }}
            >
              {type}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {sparks.length === 0 && (
        <EmptyState
          message="Add your first spark"
          description={"When you add sparks, your sparks should be shown here."}
          Icon={EmptyIcon}
          className={classes.hoverableEmptyState}
          onClick={handleAddButton}
        />
      )}

      {sparks.length > 0 && "todo"}
    </>
  );
}
