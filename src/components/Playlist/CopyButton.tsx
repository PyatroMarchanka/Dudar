import { IconButton } from "@material-ui/core";
import CopyToClipboard from "react-copy-to-clipboard";
import { Icon } from "../global/Icon";
import { IPlaylist, PlaylistSong } from "../../dataset/songs/interfaces";
import { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";

interface Props {
  playlist: IPlaylist;
  allSongs: PlaylistSong[];
}
export const CopyButton = ({ playlist, allSongs }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const playlistSongs = playlist?.songsIds
      .map(
        (id, i) => `${i + 1}. ${allSongs.find((song) => song._id === id)?.name}`
      )
      .filter(Boolean);
    return playlistSongs?.join("\n");
  };

  const handleCopyClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CopyToClipboard text={handleCopy()} onCopy={handleCopyClick}>
      <Tooltip title={copied ? "Copied" : ""} open={copied} arrow>
        <IconButton color="primary">
          <Icon type="copy" fill="#6E6E6E" />
        </IconButton>
      </Tooltip>
    </CopyToClipboard>
  );
};
