import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/VisibilityOff";
import MultiSelect from "@antlerengineering/multiselect";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useFiretableContext } from "contexts/firetableContext";
import { useAppContext } from "contexts/appContext";
import { DocActions } from "hooks/useDoc";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    popover: {
      width: 352,
      height: 422,
    },
  })
);
const HiddenFields = () => {
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const { tableState } = useFiretableContext();
  const { userDoc } = useAppContext();
  const userDocHiddenFields =
    userDoc.state.doc?.tables[`${tableState?.tablePath}`]?.hiddenFields;

  useEffect(() => {
    if (userDocHiddenFields) {
      setHiddenFields(userDocHiddenFields);
    } else {
      setHiddenFields([]);
    }
  }, [userDocHiddenFields]);
  if (!tableState || !userDoc) return <></>;
  const tableColumns = Object.keys(tableState.columns).map(key => ({
    value: key,
    label: tableState.columns[key].name,
  }));

  const handleChange = value => {
    setHiddenFields(value);
  };

  const handleSave = () => {
    userDoc.dispatch({
      action: DocActions.update,
      data: {
        tables: { [`${tableState?.tablePath}`]: { hiddenFields } },
      },
    });
  };
  return (
    <MultiSelect
      label={"Hidden fields"}
      labelPlural={"Fields"}
      options={tableColumns}
      value={hiddenFields}
      onChange={handleChange}
      onOpen={() => {}}
      onClose={handleSave}
    />
  );
};
export default HiddenFields;
