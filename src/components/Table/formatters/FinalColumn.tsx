import { FormatterProps } from "react-data-grid";

import { makeStyles, createStyles } from "@material-ui/styles";
import { Stack, Tooltip, IconButton, alpha } from "@material-ui/core";
import CopyCellsIcon from "assets/icons/CopyCells";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";

import { useConfirmation } from "components/ConfirmationDialog/Context";
import { useProjectContext } from "contexts/ProjectContext";
import useKeyPress from "hooks/useKeyPress";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".final-column-cell": {
        ".rdg.rdg .rdg-cell&": {
          backgroundColor: "var(--header-background-color)",
          borderColor: "var(--header-background-color)",
          color: theme.palette.text.disabled,
          padding: "var(--cell-padding)",
        },
      },
    },
  })
);

export default function FinalColumn({ row }: FormatterProps<any, any>) {
  useStyles();

  const { requestConfirmation } = useConfirmation();
  const { tableActions } = useProjectContext();
  const altPress = useKeyPress("Alt");

  const handleDelete = async () => tableActions?.row.delete(row.id);
  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Duplicate Row">
        <IconButton
          size="small"
          color="inherit"
          onClick={() => {
            const clonedRow = { ...row };
            // remove metadata
            delete clonedRow.ref;
            delete clonedRow.rowHeight;
            delete clonedRow._updatedAt;
            delete clonedRow._updatedBy;
            delete clonedRow._createdAt;
            Object.keys(clonedRow).forEach((key) => {
              if (clonedRow[key] === undefined) {
                delete clonedRow[key];
              }
            });
            if (tableActions) tableActions?.row.add(clonedRow);
          }}
          aria-label="Duplicate Row"
          className="row-hover-iconButton"
        >
          <CopyCellsIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={`Delete Row${altPress ? "" : "…"}`}>
        <IconButton
          size="small"
          color="inherit"
          onClick={
            altPress
              ? handleDelete
              : () => {
                  requestConfirmation({
                    title: "Delete Row?",
                    confirm: "Delete",
                    handleConfirm: handleDelete,
                  });
                }
          }
          aria-label="Delete row…"
          className="row-hover-iconButton"
          sx={{
            ".rdg-row:hover &.row-hover-iconButton": {
              color: "error.main",
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.error.main,
                  theme.palette.action.hoverOpacity * 2
                ),
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
