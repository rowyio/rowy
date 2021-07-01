import { useContext, useEffect } from "react";
import { SnackContext } from "contexts/SnackContext";

const TestView = () => {
  const snackContext = useContext(SnackContext);

  useEffect(() => {
    // alert("OPEN");
    snackContext.open({
      variant: "progress",
      message: "Preparing files for download",
      duration: undefined,
    });

    snackContext.setProgress({ value: 90, target: 120 });
  }, []);

  return <></>;
};

export default TestView;
