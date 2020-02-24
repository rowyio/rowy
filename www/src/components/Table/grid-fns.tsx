import React, { lazy, Suspense } from "react";
import { FieldType } from "constants/fields";
import { Editors } from "react-data-grid-addons";
import _uniq from "lodash/uniq";

import ErrorBoundary from "components/ErrorBoundary";

const { AutoComplete } = Editors;

const MultiSelect = lazy(() => import("../Fields/MultiSelect"));
const DateField = lazy(() => import("../Fields/Date"));
const Rating = lazy(() => import("../Fields/Rating"));
const Number = lazy(() => import("../Fields/Number"));
const CheckBox = lazy(() => import("../Fields/CheckBox"));
const UrlLink = lazy(() => import("../Fields/UrlLink"));
const Image = lazy(() => import("../Fields/Image"));
const File = lazy(() => import("../Fields/File"));
const LongText = lazy(() => import("../Fields/LongText"));
const Json = lazy(() => import("../Fields/Json"));
const RichText = lazy(() => import("../Fields/RichText"));
const Color = lazy(() => import("../Fields/Color"));
const Action = lazy(() => import("../Fields/Action"));
const SubTable = lazy(() => import("../Fields/SubTable"));

export const editable = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.rating:
    case FieldType.number:
    case FieldType.checkbox:
    case FieldType.multiSelect:
    case FieldType.image:
    case FieldType.file:
    case FieldType.longText:
    case FieldType.richText:
    case FieldType.connectTable:
    case FieldType.subTable:
    case FieldType.color:
    case FieldType.action:
    case FieldType.last:
    case FieldType.json:
      return false;
    default:
      return true;
  }
};

export const onSubmit = (key: string, row: any, uid?: string) => async (
  value: any
) => {
  const collection = row.ref.parent.path;
  const data = { collection, id: row.ref.id, doc: { [key]: value } };

  if (value !== null || value !== undefined) {
    const _ft_updatedAt = new Date();
    const _ft_updatedBy = uid ?? "";
    row.ref.update({
      [key]: value,
      _ft_updatedAt,
      updatedAt: _ft_updatedAt,
      _ft_updatedBy,
      updatedBy: _ft_updatedBy,
    });
  }
};

export const onGridRowsUpdated = (event: any) => {
  const { fromRowData, updated, action } = event;
  if (action === "CELL_UPDATE") {
    onSubmit(Object.keys(updated)[0], fromRowData)(Object.values(updated)[0]);
  }
};
export const onCellSelected = (args: any) => {};

const CellWrapper: React.FC = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<div />}>{children}</Suspense>
  </ErrorBoundary>
);

export const cellFormatter = (column: any) => {
  const { type, key, options } = column;

  switch (type) {
    case FieldType.date:
    case FieldType.dateTime:
      return (props: any) => (
        <CellWrapper>
          <DateField
            {...props}
            onSubmit={onSubmit(key, props.row)}
            fieldType={type}
          />
        </CellWrapper>
      );

    case FieldType.rating:
      return (props: any) => (
        <CellWrapper>
          <Rating
            {...props}
            column={column}
            onSubmit={onSubmit(key, props.row)}
            value={typeof props.value === "number" ? props.value : 0}
          />
        </CellWrapper>
      );
    case FieldType.color:
      return (props: any) => (
        <CellWrapper>
          <Color {...props} onSubmit={onSubmit(key, props.row)} />
        </CellWrapper>
      );
    case FieldType.checkbox:
      return (props: any) => (
        <CellWrapper>
          <CheckBox
            column={column}
            {...props}
            onSubmit={onSubmit(key, props.row)}
          />
        </CellWrapper>
      );
    case FieldType.url:
      return (props: any) => (
        <CellWrapper>
          <UrlLink {...props} />
        </CellWrapper>
      );
    case FieldType.action:
      return (props: any) => (
        <CellWrapper>
          <Action
            scripts={column.scripts}
            callableName={column.callableName}
            fieldName={key}
            {...props}
            onSubmit={onSubmit(key, props.row)}
          />
        </CellWrapper>
      );
    case FieldType.multiSelect:
      return (props: any) => (
        <CellWrapper>
          <MultiSelect
            {...props}
            onSubmit={onSubmit(key, props.row)}
            options={options}
          />
        </CellWrapper>
      );
    case FieldType.image:
      return (props: any) => (
        <CellWrapper>
          <Image
            {...props}
            onSubmit={onSubmit(key, props.row)}
            fieldName={key}
          />
        </CellWrapper>
      );
    case FieldType.file:
      return (props: any) => (
        <CellWrapper>
          <File
            {...props}
            onSubmit={onSubmit(key, props.row)}
            fieldName={key}
          />
        </CellWrapper>
      );
    case FieldType.longText:
      return (props: any) => (
        <CellWrapper>
          <LongText
            {...props}
            fieldName={key}
            onSubmit={onSubmit(key, props.row)}
          />
        </CellWrapper>
      );
    case FieldType.json:
      return (props: any) => (
        <CellWrapper>
          <Json
            {...props}
            fieldName={key}
            onSubmit={onSubmit(key, props.row)}
          />
        </CellWrapper>
      );
    case FieldType.richText:
      return (props: any) => (
        <CellWrapper>
          <RichText
            {...props}
            fieldName={key}
            onSubmit={onSubmit(key, props.row)}
          />
        </CellWrapper>
      );
    case FieldType.subTable:
      return (props: any) => (
        <CellWrapper>
          <SubTable
            fieldName={key}
            {...props}
            parentLabel={column.parentLabel}
            onSubmit={onSubmit(key, props.row)}
          />
        </CellWrapper>
      );

    default:
      return false;
  }
};

export const singleSelectEditor = (options: string[]) => {
  if (options) {
    const _options = options.map(option => ({
      id: option,
      value: option,
      title: option,
      text: option,
    }));
    return <AutoComplete options={_options} />;
  }

  return <AutoComplete options={[]} />;
};

export class NumberEditor extends React.Component<any> {
  constructor(props) {
    super(props);
  }
  state = { value: this.props.value };
  inputRef = React.createRef<HTMLInputElement>();

  getInputNode() {
    return this.inputRef?.current;
  }

  getValue() {
    return { [this.props.column.key]: this.state.value };
  }

  handleChangeComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <input
        type="number"
        value={this.state.value}
        onChange={this.handleChangeComplete}
        ref={this.inputRef}
      />
    );
  }
}
