import React from "react";
import styled from "styled-components";
import { mainColors } from "../../../utils/theme";
import { Icon } from "../../global/Icon";

type Props = {};

export const MainSettings = ({}: Props) => {
  return (
    <Container>
          <BottomLineRow>
            <Icon type="duda" className="duda" />
            <Title>
                Instrument Type
            </Title>
          </BottomLineRow>
        <InstrumentType>
            <TypeItem>
                <TypeItem__Container>
                    <Dot></Dot>
                        <SettingsInscrBig>
                            Duda in B
                        </SettingsInscrBig>
                </TypeItem__Container>
                    <SettingsInscrSmall>
                    G maj / E min
                    </SettingsInscrSmall>
            </TypeItem>
            <TypeItem>
                <TypeItem__Container>
                    <Dot></Dot>
                    <SettingsInscrBig>
                        Duda in A
                    </SettingsInscrBig>
                </TypeItem__Container>
                <SettingsInscrSmall>
                    G maj / E min
                </SettingsInscrSmall>
            </TypeItem>
            <TypeItem>
                <TypeItem__Container>
                    <Dot></Dot>
                    <SettingsInscrBig>
                        Duda in G
                    </SettingsInscrBig>
                </TypeItem__Container>
                <SettingsInscrSmall>
                    G maj / E min
                </SettingsInscrSmall>
            </TypeItem>
            <TypeItem>
                <TypeItem__Container>
                    <Dot></Dot>
                    <SettingsInscrBig>
                        Duda in F
                    </SettingsInscrBig>
                </TypeItem__Container>
                <SettingsInscrSmall>
                    G maj / E min
                </SettingsInscrSmall>
            </TypeItem>
            <TypeItem>
                <TypeItem__Container>
                    <Dot></Dot>
                    <SettingsInscrBig>
                        Duda in E
                    </SettingsInscrBig>
                </TypeItem__Container>
                <SettingsInscrSmall>
                    G maj / E min
                </SettingsInscrSmall>
            </TypeItem>
            <TypeItem>
                <TypeItem__Container>
                    <Dot></Dot>
                    <SettingsInscrBig>
                        Duda in D
                    </SettingsInscrBig>
                </TypeItem__Container>
                <SettingsInscrSmall>
                    G maj / E min
                </SettingsInscrSmall>
            </TypeItem>
        </InstrumentType>
      <BottomLineRow>
        <Icon type="duda" className="duda" />
        <Title>
            Drones
        </Title>
      </BottomLineRow>
    </Container>
  );
};

// <div>
//     <input type="radio" id="duda_b" name="instr_type" value="duda_b"
//            checked>
//         <label htmlFor="duda_b"> Duda in B</label>
// </div>
// <div>
//     <input type="radio" id="duda_a" name="instr_type" value="duda_a"
//            checked>
//         <label htmlFor="duda_a"> Duda in A</label>
// </div>
// <div>
//     <input type="radio" id="duda_g" name="instr_type" value="duda_g"
//            checked>
//         <label htmlFor="duda_g"> Duda in G</label>
// </div>
// <div>
//     <input type="radio" id="duda_f" name="instr_type" value="duda_f"
//            checked>
//         <label htmlFor="duda_f"> Duda in F</label>
// </div>
// <div>
//     <input type="radio" id="duda_e" name="instr_type" value="duda_e"
//            checked>
//         <label htmlFor="duda_e"> Duda in E</label>
// </div>
// <div>
//     <input type="radio" id="duda_d" name="instr_type" value="duda_d"
//            checked>
//         <label htmlFor="duda_d"> Duda in D</label>
// </div>

const Container = styled.div``;

const InstrumentType = styled.div`
    display: flex;
    flex-direction: column;
`;

const TypeItem__Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 14px;
    align-items: center;
`;

const TypeItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    padding: 0 3%;
`;

const Dot = styled.div`
    border: 2px ${mainColors.lightGrey} solid;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: red;
`;

const SettingsInscrBig = styled.h3`
    color: ${mainColors.midGrey};
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 140%;
    letter-spacing: 0.003em;

`;

const SettingsInscrSmall = styled.h3`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 152%;

    letter-spacing: 0.018em;
    
    color: #463131;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const BottomLineRow = styled(Row)`
  border-bottom: 2px solid ${mainColors.lightGrey};
  margin 0 6%;
`;

const Title = styled.h3`
  color: ${mainColors.midGrey};
  font-weight: 600;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 20px;
`;
