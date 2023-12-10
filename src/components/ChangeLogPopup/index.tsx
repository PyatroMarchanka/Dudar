import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { theme } from "../../utils/theme";
import { Icon } from "../global/Icon";
import InfoIcon from "@material-ui/icons/Info";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { updatesAlertId } from "../../constants/localStorage";
import styled from "styled-components";

interface UpdatedContentProps {}

export const UpdatesContent = ({}: UpdatedContentProps) => {
  const { t } = useTranslation("translation");

  const updatesList = (
    <ul>
      {t("about.updates")
        .split("\n")
        .map((str) => (
          <li key={str}>
            <DialogContentText>{str}</DialogContentText>
          </li>
        ))}
    </ul>
  );

  return <DialogContent>{updatesList}</DialogContent>;
};

interface Props {}

const ChangeLogPopup = (props: Props) => {
  const { t } = useTranslation("translation");
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const InfoButton = <Icon type="material" fill={theme.colors.black} Icon={InfoIcon} />;

  useEffect(() => {
    const isAlertClosed = localStorage.getItem(updatesAlertId);

    if (!isAlertClosed) {
      setOpen(true);
      localStorage.setItem(updatesAlertId, "closed");
    } else {
      handleClose();
    }
  }, []);

  return (
    <ChangeLogPopupContainer>
      <div onClick={handleClickOpen}>
        <IconButton  onClick={() => handleClickOpen()} className="close">
          {InfoButton}
        </IconButton>
      </div>

      <Dialog maxWidth="xl" style={{}} disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>{t("about.updatesTitle")}</DialogTitle>
        <DialogContent>
          <UpdatesContent />
          <DialogActions>
            <Button onClick={handleClose || (() => {})} color="primary" autoFocus>
              {t("gotIt")}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </ChangeLogPopupContainer>
  );
};

export default ChangeLogPopup;


const ChangeLogPopupContainer = styled.div`
  .close {
    padding-left: 0;
    padding-right: 0;
  }
`;