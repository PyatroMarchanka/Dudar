import React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const LoginReminder: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const classes = useStyles();
  const { t } = useTranslation("translation");
  const histoty = useHistory();
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <AccountCircleIcon className={classes.icon} />
        {t("login.reminderTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{t("login.reminderText")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("login.cancel")}
        </Button>
        <Button
          onClick={() => {
            onClose();
            histoty.push(routes.login);
          }}
          color="primary"
        >
          {t("login.login")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginReminder;
