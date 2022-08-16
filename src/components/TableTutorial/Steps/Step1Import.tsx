import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { ITableTutorialStepComponentProps } from ".";

import { Typography } from "@mui/material";
import TutorialCheckbox from "@src/components/TableTutorial/TutorialCheckbox";

import { tableScope, tableRowsAtom } from "@src/atoms/tableScope";

export const Step1Import = {
  id: "import",
  title: "Let’s create a simple product pricing table.",
  description:
    "Rowy connects to your database and displays it in a spreadsheet UI, making it easy to manage your data.",
  StepComponent,
  completeText: (
    <Typography variant="body1">
      <strong>Great work!</strong> Save time by importing data to tables. You
      can also export your data to CSV, TSV, and JSON.
    </Typography>
  ),
};

export default Step1Import;

function StepComponent({ setComplete }: ITableTutorialStepComponentProps) {
  const [checked, setChecked] = useState([false]);
  if (checked.every(Boolean)) setComplete(true);
  else setComplete(false);
  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setChecked((c) => {
        const cloned = [...c];
        cloned.splice(index, 1, event.target.checked);
        return cloned;
      });

  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  useEffect(() => {
    if (tableRows.length >= 5)
      handleChange(0)({ target: { checked: true } } as any);
  }, [tableRows]);

  return (
    <>
      <ol>
        <li>
          <TutorialCheckbox
            label="Begin by clicking “Import CSV” to import our sample dataset"
            checked={checked[0]}
            onChange={handleChange(0)}
          />
        </li>
      </ol>
    </>
  );
}
