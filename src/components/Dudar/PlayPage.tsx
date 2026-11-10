import { SongList } from "../SongList";
import ChangeLogPopup from "../ChangeLogPopup";
import { noSongsLabel, store } from "../../context";
import { useSongTitle } from "../../hooks/useSongTitle";
import { Settings } from "../Controls/Settings";
import { Header, SettingsButtons } from "./common";
import { SongTitle } from "./SongTitle";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useLoadSong } from "../../hooks/useLoadSong";
import { useParams } from "react-router-dom";
import { FavoriteButton } from "../FavoriteButton";
import { ShareButton } from "../ShareButton";
import { SongSeo } from "../SEO/SongSeo";

interface Props {
  midiPlayer: MidiPlayer | null;
}

export const PlayPageHeader = ({ midiPlayer }: Props) => {
  const songTitle = useSongTitle();
  const { id } = useParams<{ id: string }>();
  useLoadSong();

  return (
    <SettingsButtons className="settingsButtons">
      <SongSeo songId={id} title={songTitle} />
      <SongList player={midiPlayer} />
      <Header>
        <SongTitle title={songTitle ?? noSongsLabel} />
      </Header>
      <FavoriteButton />
      <ShareButton />
      <ChangeLogPopup />
      <Settings midiPlayer={midiPlayer} />
    </SettingsButtons>
  );
};
