import { useParams } from "react-router-dom";
import { noSongsLabel } from "../../context";
import { useSongTitle } from "../../hooks/useSongTitle";
import { useAbcFromMelody, useAbcFromQuery, useAbcSong } from "../../hooks/useAbcSong";
import { Settings } from "../Controls/Settings";
import { Header, SettingsButtons } from "./common";
import { SongTitle } from "./SongTitle";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useEffect } from "react";
import { ShareButton } from "../ShareButton";
import { routes } from "../../router/routes";

interface Props {
  midiPlayer: MidiPlayer | null;
}

// Header for the ABC-notation player (/app/abc?abc=...). Unlike
// PlayPageHeader it doesn't render SongList or SongPageModal, since there is
// no catalog song to browse or share - just keeps this route light enough
// to embed in an iframe.
export const AbcPlayPageHeader = ({ midiPlayer }: Props) => {
  useAbcSong(useAbcFromQuery());
  return <AbcHeader midiPlayer={midiPlayer} />;
};

// Same player for a melody a user saved on the My melodies page (/app/melody/:id)
export const UserMelodyPlayPageHeader = ({ midiPlayer }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { abc, title } = useAbcFromMelody(id);
  useAbcSong(abc, title);
  const shareUrl = `${window.location.origin}${routes.app}/${routes.melody}/${id}`;
  return <AbcHeader midiPlayer={midiPlayer} shareUrl={shareUrl} />;
};

const AbcHeader = ({ midiPlayer, shareUrl }: Props & { shareUrl?: string }) => {
  const songTitle = useSongTitle();

  useEffect(() => {
    document.title = songTitle ?? noSongsLabel;
  }, [songTitle]);

  return (
    <SettingsButtons className="settingsButtons">
      <Header>
        <SongTitle title={songTitle ?? noSongsLabel} />
      </Header>
      {shareUrl && <ShareButton url={shareUrl} title={songTitle ?? undefined} />}
      <Settings midiPlayer={midiPlayer} showSongInfo={false} />
    </SettingsButtons>
  );
};
