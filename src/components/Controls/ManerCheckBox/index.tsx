import { Button, FormControlLabel, Switch } from "@material-ui/core";
import { CheckBox, CheckBoxOutlined } from "@material-ui/icons";
import React, { useContext } from "react";
import styled from "styled-components";
import { store } from "../../../context";

type Props = {};

export default ({}: Props) => {
  const {
    state: { isClosedManer },
    setIsClosedManer,
  } = useContext(store);

  const label = isClosedManer ? "closed maner" : "open maner";

  const onChange = () => {
    setIsClosedManer(!isClosedManer);
  };

  return (
    <Button size="small" variant="outlined" onClick={() => onChange()}>
      {label}
    </Button>
  );
};
