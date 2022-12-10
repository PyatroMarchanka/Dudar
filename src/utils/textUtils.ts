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

  return filename
    .split("/")[1]
    .split(/.midi|.mid|.MID/)
    .join("")
    .split("_")
    .join(" ");
};
