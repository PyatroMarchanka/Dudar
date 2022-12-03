import { MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import { transposeNote } from "../../../interfaces";
import { SetTransposeType } from "../../../utils/MidiPlayer";
import { ModalButton } from "../../global/ModalButton";
import { useSelectStyles } from "../../global/selectStyles";

interface Props {
  setTranspose?: SetTransposeType;
  label?: string;
  transpose: number;
}

export default ({
  setTranspose,
  transpose,
  label = "Transpose sound",
}: Props) => {
  const [value, setValue] = useState<number>(transpose);
  const options = new Array(24)
    .fill(undefined)
    .map((_, i) => ({ value: i - 12, label: i - 12 }));
  const selectClasses = useSelectStyles();

  return (
    <ModalButton
      buttonLabel={"Transpose"}
      dialogContent={
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
              <MenuItem value={option.value}>
                <b>{transposeNote("A", +option.label)}</b>
                {` : ${option.label} semitones`}
              </MenuItem>
            ))}
          </Select>
        </div>
      }
    />
  );
};
