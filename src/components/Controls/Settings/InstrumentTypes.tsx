import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "../../../context";
import { BagpipeTypes } from "../../../interfaces";
import { RedRadio } from "../../global/RedRadioButton";
import styled from "styled-components";
import { mainColors } from "../../../utils/theme";
import { bagpipes } from "../../../dataset/bagpipes";
import { useUpdateUserSettings } from "../../../hooks/useGoogleProfile";
import Modal from "../../global/Modal";
import { IconButton } from "@material-ui/core";
import { Icon } from "../../global/Icon";
import { Add } from "@material-ui/icons";

export const InstrumentTypes = () => {
  const { t } = useTranslation("translation");
  const { updateUserSettings } = useUpdateUserSettings();
  const {
    state: { bagpipeType },
    setBagpipeType,
  } = useContext(store);

  const belarusianDudaTypes = [
    BagpipeTypes.BelarusianTraditionalDuda,
    BagpipeTypes.BelarusianOpenDuda,
    BagpipeTypes.BelarusianNONTraditionalDuda,
  ];
  const otherTypes = [
    BagpipeTypes.Polish,
    BagpipeTypes.Dudelsack,
    BagpipeTypes.Highlander,
  ];


  const onChange = (bagpipeType: BagpipeTypes) => {
    setBagpipeType(bagpipeType);
    updateUserSettings({ bagpipeType: bagpipeType });
  };

  return (
    <InstrumentTypesContainer>
      <BelDuda>
      <TypeItem
        key={"belarusianDudaTypes"}
        onClick={() => onChange(BagpipeTypes.BelarusianTraditionalDuda)}
      >
        <RedRadio
          checked={belarusianDudaTypes.includes(bagpipeType)}
          name="radio-button-demo"
          inputProps={{ "aria-label": "C" }}
        />
        <BigTitle>
          {t(`dudas.${bagpipes[belarusianDudaTypes.includes(bagpipeType) ? bagpipeType : BagpipeTypes.BelarusianTraditionalDuda].name}`)}
        </BigTitle>
      </TypeItem>

      <Modal
        triggerComponent={<IconButton><Icon type="material" Icon={Add} /></IconButton>}
      >
        {belarusianDudaTypes.map((type, i) => (
        <TypeItem key={type} onClick={() => onChange(type as BagpipeTypes)}>
          <RedRadio
            checked={type === bagpipeType}
            name="radio-button-demo"
            inputProps={{ "aria-label": "C" }}
          />
          <BigTitle>{t(`dudas.${bagpipes[type].name}`)}</BigTitle>
        </TypeItem>
      ))}
      </Modal>
      </BelDuda>
      {otherTypes.map((type, i) => (
        <TypeItem key={type} onClick={() => onChange(type as BagpipeTypes)}>
          <RedRadio
            checked={type === bagpipeType}
            name="radio-button-demo"
            inputProps={{ "aria-label": "C" }}
          />
          <BigTitle>{t(`dudas.${bagpipes[type].name}`)}</BigTitle>
        </TypeItem>
      ))}
    </InstrumentTypesContainer>
  );
};

const BelDuda = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InstrumentTypesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TypeItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  padding: 0 3%;
`;

const BigTitle = styled.h3`
  color: ${mainColors.midGrey};
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0.003em;
  margin-left: 10px;
`;
