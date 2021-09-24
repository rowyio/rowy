import * as yup from "yup";

import { FormDialog } from "@rowy/form-builder";

const yupReducer = (validationConfig) => (acc, currKey) => {
  if (validationConfig[currKey] !== null) {
    const args = Array.isArray(validationConfig[currKey])
      ? validationConfig[currKey]
      : [validationConfig[currKey]];
    return acc[currKey](...args);
  } else return acc[currKey]();
};
const yupOrderKeys = (acc, currKey) => {
  if (["string", "array"].includes(currKey)) return [currKey, ...acc];
  else return [...acc, currKey];
};

const validationCompiler = (validation) =>
  Object.keys(validation)
    .reduce(yupOrderKeys, [])
    .reduce(yupReducer(validation), yup);

export default function ParamsDialog({
  column,
  handleRun,
  open,
  handleClose,
}: any) {
  /*
 Refrence fields config  
  const _fields = [{
    type: 'text',
    name: "newCohort",
    label: "New Cohort",
    validation:{string:null,required:'needs to specific the cohort to new cohort'},
  },
  {
    type: 'multiSelect',
    name: "newCohortSelect",
    label: "New Cohort",
    options: ['SYD1','SYD3'],
    validation:{array:null,required:'needs to specific the cohort to new cohort',max:[1,'only one cohort is allowed']},
  }]
*/
  const fields = column.config.params.map((field) => ({
    ...field,
    validation: field.validation ? validationCompiler(field.validation) : null,
  }));

  if (!open) return null;

  return (
    <FormDialog
      onClose={handleClose}
      title={`${column.name as string}`}
      fields={fields}
      values={{}}
      onSubmit={handleRun}
      SubmitButtonProps={{ children: "Run" }}
    />
  );
}
