export const formatMidiFileName = (filename: string) => {
  if (!filename) {
    return;
  }
  return filename
    .split(/.midi|.mid|.MID/)
    .join("")
    .split("_")
    .join(" ");
};

export const formatMidiFileNameForTitle = (filename: string) => {
  if (!filename) {
    return;
  }

  const songName = filename.split("/")[1];

  if (!songName) {
    return;
  }

  return songName
    .split(/.midi|.mid|.MID/)
    .join("")
    .split("_")
    .join(" ");
};

export const secondsToTime = (secs: number) => {
  let sec_num = secs; // don't forget the second param
  let minutes = Math.floor(sec_num / 60).toString();
  let secsToShow = Math.floor(secs % 60).toString();

  if (Math.floor(secs % 60) < 10) {
    secsToShow = "0" + secsToShow;
  }

  return minutes + ":" + secsToShow;
};
