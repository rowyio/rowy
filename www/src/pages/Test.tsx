import React, { useContext, useEffect } from "react";
import { SnackContext } from "contexts/SnackContext";

const TestView = () => {
  const snackContext = useContext(SnackContext);

  useEffect(() => {
    snackContext.open({
      variant: "progress",
      message: "Preparing files to be downloading",
      duration: undefined,
    });

    snackContext.setProgress({ value: 40, target: 120 });
  }, []);

  return <></>;
};

export default TestView;
