import React, { useState } from "react";
import styled from "styled-components";
import { SetTransposeType } from "../../../utils/MidiPlayer";

interface Props {
  setTranspose?: SetTransposeType;
  label?: string;
}

export default ({ setTranspose, label = "Transpose sound" }: Props) => {
  const [value, setValue] = useState(0);
  const options = new Array(24)
    .fill(undefined)
    .map((_, i) => ({ value: i - 12, label: i - 12 }));

  return (
    <div>
      <h4>{label}</h4>
      <Select
        value={value}
        onChange={(e) => {
          setTranspose && setTranspose(Number(e.target.value));
          setValue(Number(e.target.value));
        }}
      >
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </Select>
    </div>
  );
};

const Select = styled.select``;
