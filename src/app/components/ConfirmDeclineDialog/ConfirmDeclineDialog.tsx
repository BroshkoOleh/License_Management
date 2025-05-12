import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface ConfirmDeclineDialogProps {
  open: boolean;
  dialogTitle: string;
  dialogText: string;
  confirmText: string;
  declineText: string;
  handleConfirmAction: () => void;
  handleDeclineAction: () => void;
}

export const ConfirmDeclineDialog = ({
  open,
  dialogTitle,
  dialogText,
  confirmText,
  declineText,
  handleConfirmAction,
  handleDeclineAction,
}: ConfirmDeclineDialogProps) => {
  return (
    <Dialog open={open} onClose={handleDeclineAction} fullWidth maxWidth="xs">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>{dialogText}</DialogContent>
      <DialogActions>
        <Button sx={{ color: "red" }} onClick={handleDeclineAction}>
          {declineText}
        </Button>
        <Button sx={{ color: "green" }} onClick={handleConfirmAction}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeclineDialog;
