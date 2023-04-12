import { ReactNode } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import ButtonLoader from "../ButtonLoader";
import { useMediaQuery } from "react-responsive";

const useStyles: any = makeStyles({
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "45%",
    height: "70%",
    background: "white",
    padding: "20px",
    overflowY: "scroll",
  },
  center: {
    width: "100%",
    textAlign: "center",
    marginBottom: "20px",
  },
});

export interface IBasicModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

const BasicModal = ({
  open,
  setOpen,
  title,
  onClose,
  children,
}: IBasicModalProps) => {
  const classes = useStyles();

  const isMediumScreen = useMediaQuery({ query: "(max-width: 970px)" });
  
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:!isMediumScreen ? "45%" : "80%",
    height: "80%",
    background: "white",
    padding: "20px",
    overflowY: "scroll",
  }}>
        <Box mt={2} mb={4} className={classes.center}>
          <Typography variant="h6" color="primary">{title}</Typography>
        </Box>
        {children}
        <Box
          mt={2}
          mb={4}
          className={classes.center}
          sx={{ cursor: "pointer" }}
        >
          <ButtonLoader
            variant="outlined"
            fullWidth
            onClick={handleClose}
            isLoading={false}
            type="submit"
          >
            <Typography>Cancel</Typography>
          </ButtonLoader>
        </Box>
      </Box>
    </Modal>
  );
};

export default BasicModal;
