import { FieldType } from "constants/fields";

import NullEditor from "./NullEditor";
import SideDrawerEditor from "./SideDrawerEditor";
import TextEditor from "./TextEditor";

/**
 * Gets the corresponding editor for each cell. Either:
 * - displays the default react-data-grid text editor,
 * - can be edited without double-clicking, or
 * - must be edited in the side drawer
 * @param column Must have column `type`
 */
export const getEditor = (column: any) => {
  const { type, config } = column;
  let _type = type;
  if (config && config.renderFieldType) {
    _type = config.renderFieldType;
  }
  switch (_type) {
    // Can be edited without double-clicking
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.checkbox:
    case FieldType.rating:
    case FieldType.image:
    case FieldType.file:
    case FieldType.singleSelect:
    case FieldType.multiSelect:
    case FieldType.color:
      return NullEditor;

    // Can be edited without double-clicking; side drawer editor not implemented
    case FieldType.subTable:
      return NullEditor;

    // Supports react-data-grid’s in-cell editing
    case FieldType.shortText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.number:
    case FieldType.percentage:
      return TextEditor;

    // No in-cell editing; must open side drawer
    case FieldType.longText:
    case FieldType.richText:
    case FieldType.slider:
    case FieldType.json:
    case FieldType.connectTable:
    case FieldType.action:
    case FieldType.id:
    default:
      return SideDrawerEditor;
  }
};
