import React, { useContext, useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import styled from "styled-components";
import { mainColors } from "../../utils/theme";
import { store } from "../../context";

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
          <CirclesRow>
            Jckwjnd
            {circles.map((_, i) => {
              return <Circle key={i} isActive={i === clickIdx} />;
            })}
          </CirclesRow>
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

const CirclesRow = styled.div`
  display: flex;
`;

const CircleComponent = styled.div<{ isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ isActive }: { isActive: boolean }) =>
    isActive ? mainColors.darkRed : mainColors.greyColor};
`;
