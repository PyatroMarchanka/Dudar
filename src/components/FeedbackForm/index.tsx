import { Dialog, DialogContent, DialogTitle, Snackbar, TextField, colors } from "@material-ui/core";
import React, { useState } from "react";
import { Button } from "../global/Button";
import { FeedbackTypes, telegramClient } from "../../utils/feedback/client";
import { useTranslation } from "react-i18next";
import { mainColors } from "../../utils/theme";

interface Props {}

export const FeedbackForm = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isSnackBar, setIsSnackBar] = useState(false);
  const { t } = useTranslation("translation");

  const sendMessage = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await telegramClient({ text: message, name, type: FeedbackTypes.Request });
      setIsSnackBar(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog maxWidth="xl" open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>{t("feedback.sendFeedback")}</DialogTitle>
        <DialogContent>
          <form style={{"textAlign": "center"}} noValidate autoComplete="off">
            <TextField
              fullWidth
              onChange={(e) => setName(e.target.value)}
              value={name}
              id="standard-basic"
              label={t("feedback.name")}
            />
            <TextField
              fullWidth
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              id="standard-basic"
              label={t("feedback.message")}
            />
            <Button
              color={mainColors.orange}
              disabled={!message || !name}
              onClick={(e) => sendMessage(e)}
            >
              {t("feedback.send")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={isSnackBar}
        autoHideDuration={3000}
        onClose={() => setIsSnackBar(false)}
        message={t("feedback.thanks")}
      />
      <Button color={mainColors.orange} onClick={() => setIsOpen(true)}>
        {t("feedback.haveAQuestion")}
      </Button>
    </>
  );
};
