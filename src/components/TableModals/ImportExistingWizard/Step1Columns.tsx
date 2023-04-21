import { useMemo, useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { sortBy, startCase } from "lodash-es";
import { IStepProps } from ".";

import {
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { AddColumn as AddColumnIcon } from "@src/assets/icons";

import ScrollableList from "@src/components/TableModals/ScrollableList";
import Column from "@src/components/Table/Mock/Column";
import EmptyState from "@src/components/EmptyState";

import { tableScope, tableRowsAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { suggestType } from "./utils";

export default function Step1Columns({ config, setConfig }: IStepProps) {
  // Get a list of fields from first 50 documents
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const tableRowsSample = tableRows.slice(0, 50);

  const allFields = useMemo(() => {
    const fields_ = new Set<string>();
    tableRowsSample.forEach((doc) =>
      Object.keys(doc).forEach((key) => {
        if (!key.startsWith("_rowy")) fields_.add(key);
      })
    );
    return Array.from(fields_).sort();
  }, [tableRowsSample]);

  // Store selected fields
  const [selectedFields, setSelectedFields] = useState<string[]>(
    sortBy(Object.keys(config), "index")
  );

  const handleSelect =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setConfig((config) =>
      selectedFields.reduce(
        (a, c, i) => ({
          ...a,
          [c]: {
            fieldName: c,
            key: c,
            name: config[c]?.name || startCase(c),
            type:
              config[c]?.type ||
              suggestType(tableRows, c) ||
              FieldType.shortText,
            index: i,
            config: {},
          },
        }),
        {}
      )
    );
  }, [selectedFields, setConfig]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" gutterBottom component="h2">
          Select columns ({selectedFields.length} of {allFields.length})
        </Typography>
        <Divider />

        <ScrollableList>
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
                selectedFields.length === allFields.length
                  ? "Clear all"
                  : "Select all"
              }
              sx={{
                height: 42,
                mr: 0,
                alignItems: "center",
                "& .MuiFormControlLabel-label": { mt: 0, flex: 1 },
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
                sx={{
                  height: 42,
                  mr: 0,
                  alignItems: "center",
                  "& .MuiFormControlLabel-label": { mt: 0, flex: 1 },
                }}
              />
            </li>
          ))}
        </ScrollableList>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" gutterBottom component="h2">
          Sort table columns
        </Typography>
        <Divider />

        {selectedFields.length === 0 ? (
          <ScrollableList>
            <EmptyState Icon={AddColumnIcon} message="No columns selected" />
          </ScrollableList>
        ) : (
          // WARNING: THIS DOES NOT WORK IN REACT 18 STRICT MODE
          <DragDropContext onDragEnd={handleDragEnd}>
            <ScrollableList>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {selectedFields.map((field, i) => (
                      <Draggable key={field} draggableId={field} index={i}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Column
                              label={field}
                              active={snapshot.isDragging}
                              secondaryItem={<DragHandleIcon />}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ScrollableList>
          </DragDropContext>
        )}
      </Grid>
    </Grid>
  );
}
