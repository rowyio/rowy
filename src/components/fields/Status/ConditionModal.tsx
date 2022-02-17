import { FormDialog } from "@rowy/form-builder";
import { conditionSettings } from "./utils/form";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDataValues } from "./utils/formatDataHelper";
import { useState } from "react";

export default function ConditionModal({
  modalState,
  isEditing,
  conditions,
  handleAdd,
  handleSave,
  handleRemove,
  handleClose,
}: any) {
  const conditionFields = conditionSettings(conditions, modalState.index);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleSubmit = (data: any) => {
    //create new obj, with init modal values, and update with data values
    const formatData = formatDataValues({ ...modalState.condition, ...data });
    if (isEditing) handleSave(formatData);
    else handleAdd(formatData);
  };

  if (!modalState.isOpen) return null;
  return (
    <>
      <FormDialog
        fields={conditionFields}
        onClose={handleClose}
        title={`${isEditing ? "Edit" : "Add"} condition`}
        values={{}}
        onSubmit={handleSubmit}
        CancelButtonProps={{
          onMouseDown: isEditing ? () => setOpenDeleteModal(true) : () => {},
          children: isEditing ? (
            <>
              {" "}
              <DeleteIcon /> Remove condition
            </>
          ) : (
            "Cancel"
          ),
        }}
        SubmitButtonProps={{
          children: isEditing ? "Save changes" : "Add",
        }}
      />
      {openDeleteModal && (
        <FormDialog
          fields={[]}
          onClose={() => setOpenDeleteModal(false)}
          title={"Are you sure you want to delete this condition?"}
          values={{}}
          onSubmit={handleRemove}
          SubmitButtonProps={{
            children: "Confirm",
          }}
        />
      )}
    </>
  );
}
