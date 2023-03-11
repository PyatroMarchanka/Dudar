import React, { useContext } from "react";
import { Button, makeStyles } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import styled from "styled-components";
import { store } from "../../../context";
import { mainColors } from "../../../utils/theme";

type Props = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

export default ({}: Props) => {
  const classes = useStyles();

  const {
    state: {},
    setBagpipeType,
  } = useContext(store);

  const onChange = () => {
    // setBagpipeType(!isClosedManer);
  };

  // const bagpipeType;

  return (
    <Container>
      <div>
        <p>Fingering manner</p>
      </div>
      <ButtonGroup
        className={classes.root}
        disableElevation
        variant="contained"
        color="primary"
      >
        <Button onClick={onChange}>Open</Button>
        <Button onClick={onChange}>Closed</Button>
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 60px;
  right: 0px;
  z-index: 10;
  display: flex;
  margin-right: 15px;
  align-items: center;
  div {
    display: flex;
    margin: 0;
  }

  p {
    display: flex;
    align-items: middle;
    max-width: 80px;
    text-align: end;
    padding-right: 10px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    margin: 0;
  }
  .MuiButton-containedPrimary.non-selected {
    font-weight: 600;
    text-transform: none;
    color: ${mainColors.darkerGray};
    background-color: white;
    border: 1px solid ${mainColors.orange};
  }

  .MuiButton-containedPrimary.selected {
    font-weight: 600;
    text-transform: none;
    color: #fff;
    background-color: ${mainColors.orange};
  }
`;
