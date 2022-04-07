import { FormatterProps } from "react-data-grid";

import { makeStyles, createStyles } from "@mui/styles";
import { Stack, Tooltip, IconButton, alpha } from "@mui/material";
import CopyCellsIcon from "@src/assets/icons/CopyCells";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import { useConfirmation } from "@src/components/ConfirmationDialog/Context";
import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";
import useKeyPress from "@src/hooks/useKeyPress";
import { isCollectionGroup } from "@src/utils/fns";

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

  const { userClaims } = useAppContext();
  const { requestConfirmation } = useConfirmation();
  const { deleteRow, addRow, table } = useProjectContext();
  const altPress = useKeyPress("Alt");

  const handleDelete = () => {
    if (deleteRow) deleteRow(row.ref);
  };

  if (!userClaims?.roles.includes("ADMIN") && table?.readOnly === true)
    return null;
  return (
    <Stack direction="row" spacing={0.5}>
      {!isCollectionGroup() && (
        <Tooltip title="Duplicate row">
          <IconButton
            size="small"
            color="inherit"
            disabled={!addRow}
            onClick={() => {
              const { ref, ...clonedRow } = row;
              addRow!(clonedRow, undefined, { type: "smaller" });
            }}
            aria-label="Duplicate row"
            className="row-hover-iconButton"
          >
            <CopyCellsIcon />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title={`Delete row${altPress ? "" : "…"}`}>
        <IconButton
          size="small"
          color="inherit"
          onClick={
            altPress
              ? handleDelete
              : () => {
                  requestConfirmation({
                    title: "Delete row?",
                    customBody: (
                      <>
                        Row path:
                        <br />
                        <code
                          style={{ userSelect: "all", wordBreak: "break-all" }}
                        >
                          {row.ref.path}
                        </code>
                      </>
                    ),
                    confirm: "Delete",
                    confirmColor: "error",
                    handleConfirm: handleDelete,
                  });
                }
          }
          aria-label={`Delete row${altPress ? "" : "…"}`}
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
