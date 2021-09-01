export type paramsDialogProps =
  | {
      column: any;
      row: any;
      handleRun: (actionParams: any) => void;
    }
  | undefined;
export interface IActionParams {
  dialogProps?: paramsDialogProps;
  handleClose: () => void;
  open: boolean;
  requestParams: (props: paramsDialogProps) => void;
}
export const CONFIRMATION_EMPTY_STATE = {
  dialogProps: undefined,
  open: false,
  handleClose: () => {},
  requestParams: () => {},
};
