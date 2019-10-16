import React from "react";
import MuiRating from "@material-ui/lab/Rating";

// TODO: Create an interface for props

interface Props {
  value: number;
  row: { id: string };
  onSubmit: Function;
  isScrolling: boolean;
}
const Rating = (props: Props) => {
  const { value, row, onSubmit } = props;
  //if (isScrolling) return <div />;
  return (
    <MuiRating
      // TODO: make it unique for each
      name={`rating-controlled-${row.id}`}
      value={value}
      onChange={(event, newValue) => {
        onSubmit(newValue);
      }}
    />
  );
};
export default Rating;
