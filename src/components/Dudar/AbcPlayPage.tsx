import { noSongsLabel } from "../../context";
import { useSongTitle } from "../../hooks/useSongTitle";
import { useAbcSong } from "../../hooks/useAbcSong";
import { Settings } from "../Controls/Settings";
import { Header, SettingsButtons, SongTitle } from "./common";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useEffect } from "react";
import { TunerButton } from "../global/TunerButton";

interface Props {
  midiPlayer: MidiPlayer | null;
}

// Header for the ABC-notation player (/app/abc?abc=...). Unlike
// PlayPageHeader it doesn't render SongList or SongPageModal, since there is
// no catalog song to browse or share - just keeps this route light enough
// to embed in an iframe.
export const AbcPlayPageHeader = ({ midiPlayer }: Props) => {
  const songTitle = useSongTitle();
  useAbcSong();

  useEffect(() => {
    document.title = songTitle ?? noSongsLabel;
  }, [songTitle]);

  return (
    <SettingsButtons className="settingsButtons">
      <Header>
        <SongTitle>{songTitle ?? noSongsLabel}</SongTitle>
      </Header>
      <TunerButton />
      <Settings midiPlayer={midiPlayer} showSongInfo={false} />
    </SettingsButtons>
  );
};
