import { MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import { SetTransposeType } from "../../../utils/MidiPlayer";

interface Props {
  setTranspose?: SetTransposeType;
  label?: string;
}

export default ({ setTranspose, label = "Transpose sound" }: Props) => {
  const [value, setValue] = useState<number>(0);
  const options = new Array(24)
    .fill(undefined)
    .map((_, i) => ({ value: i - 12, label: i - 12 }));

  return (
    <div>
      <Select
        id="demo-simple-select"
        value={value}
        onChange={(e) => {
          setTranspose && setTranspose(Number(e.target.value));
          setValue(Number(e.target.value));
        }}
      >
        {options.map((option) => (
          <MenuItem
            value={option.value}
          >{`Transpose: ${option.label} semitones`}</MenuItem>
        ))}
      </Select>
    </div>
  );
};
