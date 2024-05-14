import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "../../../context";
import { BagpipeTypes } from "../../../interfaces";
import { RedRadio } from "../../global/RedRadioButton";
import styled from "styled-components";
import { mainColors } from "../../../utils/theme";
import { bagpipes } from "../../../dataset/bagpipes";

export const InstrumentTypes = () => {
  const { t } = useTranslation("translation");

  const {
    state: { bagpipeType },
    setBagpipeType,
  } = useContext(store);

  const bagpipeTypes = [BagpipeTypes.BelarusianTraditionalDuda, BagpipeTypes.BelarusianOpenDuda, BagpipeTypes.Dudelsack, BagpipeTypes.Highlander];

  const onChange = (bagpipeType: BagpipeTypes) => {
    setBagpipeType(bagpipeType);
  };

  return (
    <InstrumentTypesContainer>
      {bagpipeTypes.map((type, i) => (
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
