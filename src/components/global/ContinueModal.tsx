import { Box, Modal, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  padding: "16px",
  outline: "none",
};

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ContinueModal: React.FC<Props> = ({ open, setOpen }) => {
  const { t } = useTranslation("translation");
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="continue-modal-title"
      aria-describedby="continue-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          {t("continueModal.title")}
        </Typography>
        <Typography>{t("continueModal.body")}</Typography>
        <Button onClick={handleClose}>Ok</Button>
      </Box>
    </Modal>
  );
};

export default ContinueModal;
