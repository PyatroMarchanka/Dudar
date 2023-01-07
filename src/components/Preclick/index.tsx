import React, { useContext, useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import styled from "styled-components";
import { mainColors } from "../../utils/theme";
import { store } from "../../context";
import { Icon } from "../global/Icon";

interface Props {}

export default ({}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    state: { isPreclick, tempo, isPlaying },
  } = useContext(store);
  const clickTime = (60 / tempo) * 1000 * 2;

  const [interval, setUpInterval] = useState<NodeJS.Timeout | null>(null);
  let [clickIdx, setTickIdx] = useState(0);

  const startPreclick = () => {
    if (!isPreclick) {
      return;
    }

    setIsOpen(true);
    const interval = setInterval(() => {
      setTickIdx(++clickIdx);
    }, clickTime);

    setUpInterval(interval);
  };

  useEffect(() => {
    if (isPlaying) {
      startPreclick();
    } else {
      setIsOpen(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (clickIdx > 3) {
      interval && clearInterval(interval);
      setTickIdx(0);
      setIsOpen(false);
    }
  }, [clickIdx]);

  const Circle = ({ isActive }: { isActive: boolean }) => (
    <CircleComponent isActive={isActive} />
  );

  const circles = new Array(4).fill(undefined);

  return (
    <Container>
      <Dialog
        maxWidth="xl"
        style={{}}
        className={"modal"}
        disableEscapeKeyDown
        open={isOpen}
        onClose={(e, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown")
            setIsOpen(false);
        }}
      >
        <DialogContent>
          <Content>
            <ClickNumber>{clickIdx + 1}</ClickNumber>
            <CirclesRow>
              <Icon type={clickIdx % 2 === 0 ? "metr-on" : "metr-on-left"} />
              {circles.map((_, i) => {
                return <Circle key={i} isActive={i === clickIdx} />;
              })}
            </CirclesRow>
          </Content>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

const Container = styled.div`
  display: inline-block;
  .modal {
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ClickNumber = styled.div`
  font-size: 50px;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
  color: ${mainColors.darkerGray};
`;

const CircleComponent = styled.div<{ isActive: boolean }>`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${({ isActive }: { isActive: boolean }) =>
    isActive ? mainColors.darkRed : mainColors.greyColor};
`;

const CirclesRow = styled.div`
  display: flex;
  align-items: center;

  svg,
  div {
    margin-right: 12px;
  }
`;
