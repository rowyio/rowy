export type datePickerProps =
  | {
      title?: string;
      customBody?: string;
      body?: string;
      cancel?: string;
      confirm?: string | JSX.Element;
      confirmationCommand?: string;
      handleConfirm: () => void;
      open?: Boolean;
    }
  | undefined;
export interface IDatePicker {
  props?: datePickerProps;
  handleClose: () => void;
  open: boolean;
  setDate: (props: datePickerProps) => void;
}
export const DATE_PICKER_EMPTY_STATE = {
  props: undefined,
  open: false,
  handleClose: () => {},
  setDate: () => {},
};
