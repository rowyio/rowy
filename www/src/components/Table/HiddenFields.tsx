import { useRef, useState, useEffect } from "react";
import _isEqual from "lodash/isEqual";
import _sortBy from "lodash/sortBy";

import { makeStyles, createStyles } from "@material-ui/styles";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import MultiSelect from "@antlerengineering/multiselect";
import ButtonWithStatus from "components/ButtonWithStatus";
import Column from "components/Wizards/Column";

import { useFiretableContext } from "contexts/FiretableContext";
import { useAppContext } from "contexts/AppContext";
import { DocActions } from "hooks/useDoc";
import { formatSubTableName } from "../../utils/fns";
const useStyles = makeStyles((theme) =>
  createStyles({
    listbox: {},
    option: {
      "$listbox &": {
        padding: theme.spacing(0, 2),
        marginBottom: -1,

        "&::after": { content: "none" },

        "&:hover, &.Mui-focused, &.Mui-focusVisible": {
          backgroundColor: "transparent",

          position: "relative",
          zIndex: 2,

          "& > div": {
            color: theme.palette.text.primary,
            borderColor: "currentColor",
            boxShadow: `0 0 0 1px ${theme.palette.text.primary} inset`,
          },
          "& $hiddenIcon": { opacity: 0.5 },
        },

        '&[aria-selected="true"], &[aria-selected="true"].Mui-focused, &[aria-selected="true"].Mui-focusVisible': {
          backgroundColor: "transparent",

          position: "relative",
          zIndex: 1,

          "& $hiddenIcon": { opacity: 1 },
        },
      },
    },

    hiddenIcon: { opacity: 0 },
  })
);

export default function HiddenFields() {
  const classes = useStyles();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { tableState } = useFiretableContext();
  const { userDoc } = useAppContext();

  const [open, setOpen] = useState(false);

  // Store local selection here
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);

  // Initialise hiddenFields from user doc
  const userDocHiddenFields =
    userDoc.state.doc?.tables?.[formatSubTableName(tableState?.tablePath!)]
      ?.hiddenFields;
  useEffect(() => {
    if (userDocHiddenFields) setHiddenFields(userDocHiddenFields);
    else setHiddenFields([]);
  }, [userDocHiddenFields]);

  if (!tableState || !userDoc) return null;

  const tableColumns = _sortBy(
    Object.entries(tableState.columns).filter(([key]) => key !== "undefined"),
    (column) => column[1].index
  ).map(([key]) => ({
    value: key,
    label: tableState.columns[key].name,
  }));

  // Save when MultiSelect closes
  const handleSave = () => {
    // Only update if there were any changes because it’s slow to update
    if (!_isEqual(hiddenFields, userDocHiddenFields))
      userDoc.dispatch({
        action: DocActions.update,
        data: {
          tables: {
            [formatSubTableName(tableState?.tablePath)]: { hiddenFields },
          },
        },
      });

    setOpen(false);
  };
  const renderOption = (props, option, { selected }) => (
    <li {...props}>
      <Column
        label={option.label}
        type={tableState.columns[option.value]?.type}
        secondaryItem={<VisibilityOffIcon className={classes.hiddenIcon} />}
        active={selected}
      />
    </li>
  );
  return (
    <>
      <ButtonWithStatus
        startIcon={<VisibilityOffIcon />}
        onClick={() => setOpen((o) => !o)}
        active={hiddenFields.length > 0}
        ref={buttonRef}
      >
        {hiddenFields.length > 0 ? `${hiddenFields.length} Hidden` : "Hide"}
      </ButtonWithStatus>
      <MultiSelect
        TextFieldProps={{
          style: { display: "none" },
          SelectProps: { open, MenuProps: { anchorEl: buttonRef.current } },
        }}
        {...({
          AutocompleteProps: {
            classes: { listbox: classes.listbox, option: classes.option },
            renderOption,
          },
        } as any)}
        label="Hidden fields"
        labelPlural="Fields"
        options={tableColumns}
        value={hiddenFields ?? []}
        onChange={setHiddenFields}
        onClose={handleSave}
      />
    </>
  );
}
