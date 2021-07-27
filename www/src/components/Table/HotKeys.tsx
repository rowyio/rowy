import useHotkeys from "../../hooks/useHotkeys";
import { FieldType } from "constants/fields";
import { useAppContext } from "contexts/AppContext";

// TODO: Hook up to FiretableContext
const onSubmit = (a: any, b: any, c?: any) => (a: any) => {};

/**
 * Listens Hot Keys combination keys to trigger keyboard shortcuts
 */
const Hotkeys = (props: any) => {
  const { selectedCell } = props;
  const { currentUser } = useAppContext();

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
    FieldType.shortText,
    FieldType.phone,
    FieldType.singleSelect,
    FieldType.longText,
    FieldType.url,
  ];
  const numberFields = [FieldType.number, FieldType.rating];
  /**
   * populate cell from clipboard
   */
  const handlePaste = async () => {
    const { row, column } = selectedCell;
    const newValue = await navigator.clipboard.readText();
    if (stringFields.includes(column.type))
      onSubmit(column.key, row, currentUser?.uid)(newValue);
    else if (numberFields.includes(column.type)) {
      const numberValue = parseInt(newValue, 10);
      if (`${numberValue}` !== "NaN") {
        onSubmit(column.key, row, currentUser?.uid)(numberValue);
      }
    }
  };
  const supportedFields = [...stringFields, ...numberFields];
  /**
   * copy cell content to clipboard works only on supported fields
   */
  const handleCopy = () => {
    const { row, column } = selectedCell;
    if (supportedFields.includes(column.type)) {
      navigator.clipboard.writeText(row[column.key]);
    }
  };
  /**
   * copy cell content to clipboard and clears cell(only on supported fields)
   */
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
