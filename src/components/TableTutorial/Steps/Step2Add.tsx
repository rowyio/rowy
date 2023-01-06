import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { isEmpty } from "lodash-es";
import { ITableTutorialStepComponentProps } from ".";

import { Typography } from "@mui/material";
import TutorialCheckbox from "@src/components/TableTutorial/TutorialCheckbox";

import {
  tableScope,
  tableColumnsOrderedAtom,
  tableRowsAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";

export const Step2Add = {
  id: "add",
  title: "Let’s add some columns and rows to your table.",
  description:
    "When you make changes made to your data in Rowy, they’re reflected in your Firestore database in realtime.",
  StepComponent,
  completeText: (
    <Typography variant="body1">
      <strong>Nicely done!</strong> Rating is just one of Rowy’s 30+ field
      types. You can explore the others when making your own tables.
    </Typography>
  ),
};

export default Step2Add;

function StepComponent({ setComplete }: ITableTutorialStepComponentProps) {
  const [checked, setChecked] = useState([false, false, false]);
  if (checked.every(Boolean)) setComplete(true);
  else setComplete(false);
  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setChecked((c) => {
        const cloned = [...c];
        cloned.splice(index, 1, event.target.checked);
        return cloned;
      });

  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  useEffect(() => {
    if (
      tableColumnsOrdered?.some(
        (c) =>
          c.type === FieldType.rating && c.name.toLowerCase().includes("rating")
      )
    )
      handleChange(0)({ target: { checked: true } } as any);
  }, [tableColumnsOrdered]);

  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  useEffect(() => {
    if (tableRows.length >= 6) {
      handleChange(1)({ target: { checked: true } } as any);

      const { _rowy_ref, ...firstRow } = tableRows[0];
      if (!isEmpty(firstRow)) {
        handleChange(2)({ target: { checked: true } } as any);
      }
    }
  }, [tableRows]);

  return (
    <>
      <ol>
        <li>
          <TutorialCheckbox
            label="Add a column named “Rating”, with the field type “Rating”"
            checked={checked[0]}
            onChange={handleChange(0)}
          />
        </li>
        <li>
          <TutorialCheckbox
            label="Add a row"
            checked={checked[1]}
            onChange={handleChange(1)}
          />
        </li>
        <li>
          <TutorialCheckbox
            label="Enter some data in the new row"
            checked={checked[2]}
            onChange={handleChange(2)}
          />
        </li>
      </ol>
    </>
  );
}
