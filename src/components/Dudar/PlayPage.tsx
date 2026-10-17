import { SongList } from "../SongList";
import ChangeLogPopup from "../ChangeLogPopup";
import { noSongsLabel, store } from "../../context";
import { useSongTitle } from "../../hooks/useSongTitle";
import { Settings } from "../Controls/Settings";
import { Header, SettingsButtons } from "./common";
import { SongTitle } from "./SongTitle";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useLoadSong } from "../../hooks/useLoadSong";
import { useEffect } from "react";
import { TunerButton } from "../global/TunerButton";
import { FavoriteButton } from "../FavoriteButton";
import { ShareButton } from "../ShareButton";

interface Props {
  midiPlayer: MidiPlayer | null;
}

export const PlayPageHeader = ({ midiPlayer }: Props) => {
  const songTitle = useSongTitle();
  useLoadSong();

  useEffect(() => {
    document.title = songTitle ?? noSongsLabel;
  }, [songTitle]);

  return (
    <SettingsButtons className="settingsButtons">
      <SongList player={midiPlayer} />
      <Header>
        <SongTitle title={songTitle ?? noSongsLabel} />
      </Header>
      <FavoriteButton />
      <ShareButton />
      <ChangeLogPopup />
      <TunerButton />
      <Settings midiPlayer={midiPlayer} />
    </SettingsButtons>
  );
};
