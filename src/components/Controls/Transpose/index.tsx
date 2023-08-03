import { MenuItem, Select } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { useSelectStyles } from "../../global/selectStyles";
import { transposeNote } from "../../../utils/midiUtils";

interface Props {
  midiPlayer: MidiPlayer | null;
}

const Transpose = ({ midiPlayer }: Props) => {
  const {
    state: { transpose, isPlaying },
    setTranspose: setTransposeCtx,
    setIsPlaying,
  } = useContext(store);

  const setTranspose = (num: number) => {
    setTransposeCtx(num);
    if (isPlaying) {
      setIsPlaying(false);
      midiPlayer?.pause();
    }
  };

  const [value, setValue] = useState<number>(transpose);
  const options = new Array(24).fill(undefined).map((_, i) => ({ value: i - 12, label: i - 12 }));
  const selectClasses = useSelectStyles();

  return (
    <div>
      <Select
        id="demo-simple-select"
        className={selectClasses.select}
        value={value}
        onChange={(e) => {
          setTranspose && setTranspose(Number(e.target.value));
          setValue(Number(e.target.value));
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            <b>{transposeNote("A", +option.label)}</b>
            {` : ${option.label} semitones`}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default Transpose;
