import { useMemo, useState, useEffect } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import _sortBy from "lodash/sortBy";
import _startCase from "lodash/startCase";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import DragHandleIcon from "@material-ui/icons/DragHandle";

import { IStepProps } from ".";
import FadeList from "../FadeList";
import Column from "../Column";
import EmptyState from "components/EmptyState";
import AddColumnIcon from "assets/icons/AddColumn";

import { useFiretableContext } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";
import { suggestType } from "./utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    spacer: { height: theme.spacing(1) },
    formControlLabel: { marginRight: 0 },
    columnLabel: { flex: 1 },
  })
);

export default function Step1Columns({ config, setConfig }: IStepProps) {
  const classes = useStyles();

  // Get a list of fields from first 50 documents
  const { tableState } = useFiretableContext();
  const allFields = useMemo(() => {
    const sample = tableState!.rows.slice(0, 50);
    const fields_ = new Set<string>();
    sample.forEach((doc) =>
      Object.keys(doc).forEach((key) => {
        if (key !== "ref") fields_.add(key);
      })
    );
    return Array.from(fields_).sort();
  }, [tableState?.rows]);

  // Store selected fields
  const [selectedFields, setSelectedFields] = useState<string[]>(
    _sortBy(Object.keys(config), "index")
  );

  const handleSelect = (field: string) => (_, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      const newSelection = [...selectedFields];
      newSelection.splice(newSelection.indexOf(field), 1);
      setSelectedFields(newSelection);
    }
  };

  const handleSelectAll = () => {
    if (selectedFields.length !== allFields.length)
      setSelectedFields(allFields);
    else setSelectedFields([]);
  };

  const handleDragEnd = (result: DropResult) => {
    const newOrder = [...selectedFields];
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination!.index, 0, removed);
    setSelectedFields(newOrder);
  };

  useEffect(() => {
    setConfig(
      selectedFields.reduce(
        (a, c, i) => ({
          ...a,
          [c]: {
            fieldName: c,
            key: c,
            name: config[c]?.name || _startCase(c),
            type:
              config[c]?.type ||
              suggestType(tableState!.rows, c) ||
              FieldType.shortText,
            index: i,
            config: {},
          },
        }),
        {}
      )
    );
  }, [selectedFields]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Typography variant="overline" gutterBottom component="h2">
          Select Columns ({selectedFields.length} of {allFields.length})
        </Typography>
        <Divider />

        <FadeList>
          <li>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.length === allFields.length}
                  indeterminate={
                    selectedFields.length !== 0 &&
                    selectedFields.length !== allFields.length
                  }
                  onChange={handleSelectAll}
                  color="default"
                />
              }
              label={
                <Typography variant="subtitle2" color="textSecondary">
                  Select all
                </Typography>
              }
              classes={{
                root: classes.formControlLabel,
                label: classes.columnLabel,
              }}
            />
          </li>
          <li className={classes.spacer} />

          {allFields.map((field) => (
            <li key={field}>
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    checked={selectedFields.indexOf(field) > -1}
                    aria-label={`Select column ${field}`}
                    onChange={handleSelect(field)}
                    color="default"
                  />
                }
                label={<Column label={field} />}
                classes={{
                  root: classes.formControlLabel,
                  label: classes.columnLabel,
                }}
              />
            </li>
          ))}
        </FadeList>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="overline" gutterBottom component="h2">
          Sort Firetable Columns
        </Typography>
        <Divider />

        {selectedFields.length === 0 ? (
          <FadeList>
            <EmptyState Icon={AddColumnIcon} message="No columns selected" />
          </FadeList>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <FadeList>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {selectedFields.map((field, i) => (
                      <li key={field}>
                        <Draggable draggableId={field} index={i}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Column
                                label={field}
                                active={snapshot.isDragging}
                                secondaryItem={<DragHandleIcon />}
                              />
                            </div>
                          )}
                        </Draggable>
                      </li>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </FadeList>
          </DragDropContext>
        )}
      </Grid>
    </Grid>
  );
}
