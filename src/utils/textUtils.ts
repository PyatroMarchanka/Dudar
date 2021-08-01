export const formatMidiFileName = (filename: string) => {
  if (!filename) {
    return;
  }
  return filename.split(/(.midi)|(.mid)|(.MID)/).join("");
};
