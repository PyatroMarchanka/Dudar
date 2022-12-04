import React, { useContext } from "react";
import {
  Button,
  FormControlLabel,
  makeStyles,
  Switch,
} from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { CheckBox, CheckBoxOutlined } from "@material-ui/icons";
import styled from "styled-components";
import { store } from "../../../context";
import { mainColors } from "../../../utils/theme";

type Props = {};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default ({}: Props) => {
  const classes = useStyles();

  const {
    state: { isClosedManer },
    setIsClosedManer,
  } = useContext(store);

  const label = isClosedManer ? "closed maner" : "open maner";

  const onChange = () => {
    setIsClosedManer(!isClosedManer);
  };

  return (
    <Container>
      <ButtonGroup
        className={classes.root}
        disableElevation
        variant="contained"
        color="primary"
      >
        <Button
          className={isClosedManer ? "selected" : "non-selected"}
          onClick={onChange}
        >
          Open
        </Button>
        <Button
          className={isClosedManer ? "non-selected" : "selected"}
          onClick={onChange}
        >
          Closed
        </Button>
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  .MuiButton-containedPrimary.non-selected {
    font-weight: 600;
    text-transform: none;
    color: ${mainColors.darkerGray};
    background-color: white;
    border: 1px solid ${mainColors.orange};
  }

  .MuiButton-containedPrimary.selected {
    text-transform: none;
    color: #fff;
    background-color: ${mainColors.orange};
  }
`;
