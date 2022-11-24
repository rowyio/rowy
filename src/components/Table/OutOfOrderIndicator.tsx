import { useAtom } from "jotai";

import { styled } from "@mui/material/styles";
import RichTooltip from "@src/components/RichTooltip";
import WarningIcon from "@mui/icons-material/WarningAmber";

import {
  projectScope,
  tableOutOfOrderDismissedAtom,
} from "@src/atoms/projectScope";

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

export default function OutOfOrderIndicator() {
  const [dismissed, setDismissed] = useAtom(
    tableOutOfOrderDismissedAtom,
    projectScope
  );

  return (
    <div
      className="out-of-order-dot"
      style={{
        position: "sticky",
        zIndex: 9,
        top: 0,
        left: 8,
        width: 12,
        marginRight: -12,
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
