import {
  Dialog,
  Paper,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import CrossIcon from "@mui/icons-material/Close";
import React, { ReactNode } from "react";

export interface ISharedDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  textConfig: {
    title: string;
    description?: string;
  };
  hasActions?: boolean;
  onSuccess: () => void;
  children?: ReactNode;
}

const SharedDialog = ({
  open,
  setOpen,
  textConfig: { title, description },
  onSuccess,
  hasActions = true,
  children,
}: ISharedDialogProps) => {
  const handleSubmit = () => {
    onSuccess();
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} PaperComponent={Paper}>
      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
        <DialogTitle style={{ cursor: "move" }}>{title}</DialogTitle>
        <Box mr={2}>
          <Button onClick={() => setOpen(false)}>
            <CrossIcon />
          </Button>
        </Box>
      </Box>
      <DialogContent>
        {description ? (
          <DialogContentText>{description}</DialogContentText>
        ) : (
          children
        )}
      </DialogContent>
      {hasActions ? (
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
};

export default SharedDialog;
