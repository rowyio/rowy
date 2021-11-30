import createPersistedState from "use-persisted-state";

import { styled } from "@mui/material/styles";
import RichTooltip from "@src/components/RichTooltip";
import WarningIcon from "@mui/icons-material/WarningAmber";
import { OUT_OF_ORDER_MARGIN } from "./TableContainer";

const useOutOfOrderTooltipDismissedState = createPersistedState(
  "__ROWY__OUT_OF_ORDER_TOOLTIP_DISMISSED"
);

const Dot = styled("div")(({ theme }) => ({
  position: "absolute",
  left: -6,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,

  width: 12,
  height: 12,

  borderRadius: "50%",
  backgroundColor: theme.palette.warning.main,
}));

export interface IOutOfOrderIndicatorProps {
  top: number;
  height: number;
}

export default function OutOfOrderIndicator({
  top,
  height,
}: IOutOfOrderIndicatorProps) {
  const [dismissed, setDismissed] = useOutOfOrderTooltipDismissedState(false);

  return (
    <div
      className="out-of-order-dot"
      style={{
        position: "absolute",
        top: top,
        height: height - OUT_OF_ORDER_MARGIN - 2,
        marginLeft: `max(env(safe-area-inset-left), 16px)`,
        width: 12,
      }}
    >
      <RichTooltip
        icon={<WarningIcon fontSize="inherit" color="warning" />}
        title="Row out of order"
        message="This row will not appear on the top of the table after you reload this page"
        placement="right"
        render={({ openTooltip }) => <Dot onClick={openTooltip} />}
        defaultOpen={!dismissed}
        onClose={() => setDismissed(true)}
      />
    </div>
  );
}
