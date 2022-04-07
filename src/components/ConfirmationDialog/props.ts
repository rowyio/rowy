export type confirmationProps =
  | {
      title?: string;
      customBody?: React.ReactNode;
      body?: string;
      cancel?: string;
      hideCancel?: boolean;
      confirm?: string | JSX.Element;
      confirmationCommand?: string;
      handleConfirm: () => void;
      handleCancel?: () => void;
      open?: Boolean;
      confirmColor?: string;
    }
  | undefined;
export interface IConfirmation {
  dialogProps?: confirmationProps;
  handleClose: () => void;
  open: boolean;
  requestConfirmation: (props: confirmationProps) => void;
}
export const CONFIRMATION_EMPTY_STATE = {
  dialogProps: undefined,
  open: false,
  handleClose: () => {},
  requestConfirmation: () => {},
};
