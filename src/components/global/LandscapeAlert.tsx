import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { landscapeAlertId } from "../../constants/localStorage";

export default function LandscapeAlert() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    localStorage.setItem(landscapeAlertId, "closed");
    setOpen(false);
  };

  useEffect(() => {
    const isAlertClosed = localStorage.getItem(landscapeAlertId);

    if (isAlertClosed) {
      handleClose();
    }
  }, []);

  return (
    <Container>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Rotate your device"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            For better experience use landscape mode
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

const Container = styled.div``;
