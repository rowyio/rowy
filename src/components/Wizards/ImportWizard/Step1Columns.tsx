import { useMemo, useState, useEffect } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import _sortBy from "lodash/sortBy";
import _startCase from "lodash/startCase";

import { makeStyles, createStyles } from "@mui/styles";
import {
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import { IStepProps } from ".";
import FadeList from "../ScrollableList";
import Column from "../Column";
import EmptyState from "@src/components/EmptyState";
import AddColumnIcon from "@src/assets/icons/AddColumn";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { FieldType } from "@src/constants/fields";
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
  const { tableState } = useProjectContext();
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

  const handleSelect = (field: string) => (e) => {
    const checked = e.target.checked;

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
        <Typography variant="subtitle2" gutterBottom component="h2">
          Select columns ({selectedFields.length} of {allFields.length})
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
              label="Select all"
              classes={{
                root: classes.formControlLabel,
                label: classes.columnLabel,
              }}
              style={{ height: 42 }}
              sx={{
                alignItems: "center",
                "& .MuiFormControlLabel-label": { mt: 0 },
              }}
            />
          </li>

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
                sx={{
                  alignItems: "center",
                  "& .MuiFormControlLabel-label": { mt: 0 },
                }}
              />
            </li>
          ))}
        </FadeList>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" gutterBottom component="h2">
          Sort table columns
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
