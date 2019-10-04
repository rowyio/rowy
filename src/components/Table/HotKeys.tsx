import React from "react";
import useHotkeys from "../../hooks/useHotkeys";
import { onSubmit } from "./grid-fns";
import { FieldType } from "../Fields";

const Hotkeys = (props: any) => {
  const { selectedCell } = props;

  useHotkeys(
    "cmd+c",
    () => {
      handleCopy();
    },
    [selectedCell]
  );
  useHotkeys(
    "ctrl+c",
    () => {
      handleCopy();
    },
    [selectedCell]
  );
  useHotkeys(
    "cmd+v",
    () => {
      handlePaste();
    },
    [selectedCell]
  );
  useHotkeys(
    "ctrl+v",
    () => {
      handlePaste();
    },
    [selectedCell]
  );
  useHotkeys(
    "ctrl+x",
    () => {
      handleCut();
    },
    [selectedCell]
  );
  useHotkeys(
    "cmd+x",
    () => {
      handleCut();
    },
    [selectedCell]
  );
  const stringFields = [
    FieldType.email,
    FieldType.simpleText,
    FieldType.PhoneNumber,
    FieldType.singleSelect,
    FieldType.url,
  ];
  const numberFields = [FieldType.number, FieldType.rating];
  const handlePaste = async () => {
    const { row, column } = selectedCell;
    const newValue = await navigator.clipboard.readText();
    if (stringFields.includes(column.type)) onSubmit(column.key, row)(newValue);
    else if (numberFields.includes(column.type)) {
      const numberValue = parseInt(newValue);
      if (`${numberValue}` !== "NaN") {
        onSubmit(column.key, row)(numberValue);
      }
    }
  };
  const supportedFields = [...stringFields, ...numberFields];
  const handleCopy = () => {
    const { row, column } = selectedCell;
    if (supportedFields.includes(column.type)) {
      navigator.clipboard.writeText(row[column.key]);
    }
  };
  const handleCut = () => {
    const { row, column } = selectedCell;
    if (supportedFields.includes(column.type)) {
      navigator.clipboard.writeText(row[column.key]);
      onSubmit(column.key, row)(null);
    }
  };
  return <></>;
};
export default Hotkeys;
