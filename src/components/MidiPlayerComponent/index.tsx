// @ts-ignore
import MIDISounds from "midi-sounds-react";
import { instruments } from "../../utils/MidiPlayer";
import styled from "styled-components";

interface Props {
    playerRef: any
}

export const MidiPlayerComponent = ({playerRef}: Props) => {
  return (
    <Container>
      <MIDISounds ref={playerRef} appElementName="root" instruments={instruments} />
    </Container>
  );
};

const Container = styled.div`
  .MIDISounds {
    display: none;
  }
`;
