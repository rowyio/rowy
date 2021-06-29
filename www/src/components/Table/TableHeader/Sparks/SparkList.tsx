import { Box, Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { parseSparkConfig, serialiseSpark, ISpark } from "./utils";
import EmptyState from "components/EmptyState";
import AddIcon from "@material-ui/icons/Add";

export interface ISparkListProps {
  sparks: ISpark[];
  handleAddSpark: () => void;
}

export default function SparkList({ sparks, handleAddSpark }: ISparkListProps) {
  const activeSparkCount = sparks.filter((spark) => spark.active).length;
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
        <Button startIcon={<AddIcon />} onClick={handleAddSpark}>
          ADD SPARK
        </Button>
      </Box>

      {sparks.length === 0 && (
        <EmptyState
          message="No Sparks Found"
          description={"When you add sparks, your sparks should be shown here."}
        />
      )}

      {sparks.length > 0 && "todo"}
    </>
  );
}
