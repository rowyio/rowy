import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
const Hide = (props: { columns }) => {
  return (
    <Button>
      Hidden <VisibilityIcon />
    </Button>
  );
};
