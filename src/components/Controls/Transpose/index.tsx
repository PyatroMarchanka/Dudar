import { MenuItem, Select } from "@material-ui/core";
import React, { useContext, useMemo, useState } from "react";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { useSelectStyles } from "../../global/selectStyles";
import { transposeNote, transposeNoteDoReMi } from "../../../utils/midiUtils";
import { useTranslation } from "react-i18next";
import { transliterate, useIsCyrylicLang } from "../../../locales";
import { useUpdateUserSettings } from "../../../hooks/useGoogleProfile";

interface Props {
  midiPlayer: MidiPlayer | null;
}

const optionsNumbers = new Array(24)
  .fill(undefined)
  .map((_, i) => ({ value: i - 12, label: i - 12 }));

const Transpose = ({ midiPlayer }: Props) => {
  const {
    state: { transpose, isPlaying },
    setTranspose: setTransposeCtx,
    setIsPlaying,
  } = useContext(store);
  const { t } = useTranslation();
  const isCyrylicLang = useIsCyrylicLang();
  const { updateUserSettings } = useUpdateUserSettings();


  
  const setTranspose = (num: number) => {
    setTransposeCtx(num);
    if (isPlaying) {
      setIsPlaying(false);
      midiPlayer?.pause();
    }
  };

  const [value, setValue] = useState<number>(transpose);
  const selectClasses = useSelectStyles();

  const options = useMemo(
    () =>
      optionsNumbers.map((option) => {
        const doRemiLabel = !isCyrylicLang()
          ? transliterate(transposeNoteDoReMi("Ля", +option.label))
          : transposeNoteDoReMi("Ля", +option.label);
        const octave = option.label <= -10 ? 3 : option.label <= 2 ? 4 : 5;

        return (
          <MenuItem key={option.label} value={option.value}>
            <b>{`${transposeNote(
              "A",
              +option.label
            )}${octave} - ${doRemiLabel}`}</b>
          </MenuItem>
        );
      }),
    [isCyrylicLang, t]
  );

  return (
    <div>
      <Select
        id="demo-simple-select"
        className={selectClasses.select}
        value={value}
        onChange={(e) => {
          setTranspose && setTranspose(Number(e.target.value));
          setValue(Number(e.target.value));
          updateUserSettings({ transpose: Number(e.target.value) });
        }}
      >
        {options}
      </Select>
    </div>
  );
};

export default Transpose;
