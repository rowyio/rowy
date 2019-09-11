import React from "react";
import MailIcon from "@material-ui/icons/MailOutline";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import SimpleTextIcon from "@material-ui/icons/TextFormat";
import LongTextIcon from "@material-ui/icons/Notes";
import PhoneIcon from "@material-ui/icons/Phone";
import propEq from "ramda/es/propEq";
import find from "ramda/es/find";
export enum FieldType {
  simpleText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  email = "EMAIL",
  PhoneNumber = "PHONE_NUMBER",
  checkBox = "CHECK_BOX"
}

export const FIELDS = [
  { icon: <SimpleTextIcon />, name: "Simple Text", type: FieldType.simpleText },
  { icon: <LongTextIcon />, name: "Long Text", type: FieldType.longText },
  { icon: <MailIcon />, name: "Email", type: FieldType.email },
  { icon: <PhoneIcon />, name: "Phone", type: FieldType.PhoneNumber },
  { icon: <CheckBoxIcon />, name: "Check Box", type: FieldType.checkBox }
];

export const getFieldIcon = (type: FieldType) => {
  return find(propEq("type", type))(FIELDS).icon;
};
