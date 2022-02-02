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
  const noConditions = Boolean(conditions?.length < 1); // Double check this

  if (noConditions) {
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
  const noCondition = Boolean(!condition);
  if (noCondition) return <></>;
  return (
    <>
      {condition?.label}
      <Grid item>
        {createValueLabel(condition)}
        <IconButton
          onClick={() => setModal({ isOpen: true, condition, index })}
        >
          <EditIcon />
        </IconButton>
      </Grid>
    </>
  );
};
