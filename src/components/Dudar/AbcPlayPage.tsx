import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconButton } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { noSongsLabel } from "../../context";
import { useSongTitle } from "../../hooks/useSongTitle";
import { useAbcFromMelody, useAbcFromQuery, useAbcSong } from "../../hooks/useAbcSong";
import { Settings } from "../Controls/Settings";
import { Header, SettingsButtons } from "./common";
import { SongTitle } from "./SongTitle";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { ReactNode, useEffect, useMemo } from "react";
import { useRollSong } from "../../hooks/useRollSong";
import { loadDraft } from "../MelodyEditor/draft";
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
  const { abc, roll, title } = useAbcFromMelody(id);
  useAbcSong(abc, title);
  useRollSong(roll, title);
  const shareUrl = `${window.location.origin}${routes.app}/${routes.melody}/${id}`;
  return <AbcHeader midiPlayer={midiPlayer} shareUrl={shareUrl} />;
};

// An unsaved melody from the piano-roll editor (/app/draft/:key), with a way back to it
export const MelodyDraftPlayPageHeader = ({ midiPlayer }: Props) => {
  const { key } = useParams<{ key: string }>();
  const { t: translate } = useTranslation("translation");
  const t = (key: string): string => translate(key) ?? "";
  const history = useHistory();
  const draft = useMemo(() => loadDraft(key), [key]);
  useRollSong(draft?.roll ?? null, draft?.title || t("melodyEditor.untitled") || undefined);
  const editorUrl = key === "new" ? routes.melodyEditor : `${routes.melodyEditor}/${key}`;

  return (
    <AbcHeader midiPlayer={midiPlayer}>
      <IconButton onClick={() => history.push(editorUrl)} aria-label={t("melodyEditor.edit") ?? ""} title={t("melodyEditor.edit") ?? ""}>
        <Edit />
      </IconButton>
    </AbcHeader>
  );
};

const AbcHeader = ({ midiPlayer, shareUrl, children }: Props & { shareUrl?: string; children?: ReactNode }) => {
  const songTitle = useSongTitle();

  useEffect(() => {
    document.title = songTitle ?? noSongsLabel;
  }, [songTitle]);

  return (
    <SettingsButtons className="settingsButtons">
      <Header>
        <SongTitle title={songTitle ?? noSongsLabel} />
      </Header>
      {children}
      {shareUrl && <ShareButton url={shareUrl} title={songTitle ?? undefined} />}
      <Settings midiPlayer={midiPlayer} showSongInfo={false} />
    </SettingsButtons>
  );
};
