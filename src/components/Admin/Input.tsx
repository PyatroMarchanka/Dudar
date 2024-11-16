import { useState } from "react";

export const Input = ({
    initialValue,
    handleEdit,
    onBlur,
  }: {
    initialValue: string;
    handleEdit: (value: string) => void;
    onBlur: (value: string) => void;
  }) => {
    const [value, setValue] = useState(initialValue);
  
    const finishEdit = () => {
      onBlur(value);
    };
    return (
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleEdit(e.target.value);
        }}
        onBlur={finishEdit}
      />
    );
  };
  