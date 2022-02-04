import Subheading from "@src/components/Table/ColumnMenu/Subheading";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import { IConditionModal } from "./Settings";
import { createValueLabel } from "./utils/conditionListHelper";

interface I_ConditionList {
  config: Record<string, any>;
  setModal: React.Dispatch<React.SetStateAction<IConditionModal>>;
}

export default function ConditionList({ config, setModal }: I_ConditionList) {
  const conditions = config?.conditions ?? [];
  if (conditions?.length === 0) {
    return (
      <>
        No conditions set yet
        <br />
      </>
    );
  }
  return (
    <>
      <Subheading>Conditions</Subheading>
      {conditions.map((condition, index) => {
        return (
          <>
            <Grid
              container
              justifyContent="space-between"
              alignItems={"center"}
            >
              <GridItem
                index={index}
                condition={condition}
                setModal={setModal}
              />
            </Grid>
            <Divider />
          </>
        );
      })}
    </>
  );
}

const GridItem = ({ condition, setModal, index }: any) => {
  if (!condition) return <></>;
  return (
    <>
      <span>{condition?.label}</span>
      <Grid item>
        <span>{createValueLabel(condition)}</span>
        <IconButton
          onClick={() => setModal({ isOpen: true, condition, index })}
        >
          <EditIcon />
        </IconButton>
      </Grid>
    </>
  );
};
