import React from "react";
import styled from "styled-components";
import { FeedbackForm } from "../FeedbackForm";
import { Typography } from "@material-ui/core";
import { mainColors } from "../../utils/theme";
import { Icon } from "../global/Icon";

interface Props {}

export const Contacts = ({}: Props) => {
  return (
    <RowCentered>
      <a
        href="https://github.com/PyatroMarchanka/Dudar"
        className="github-link"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fa fa-github fa_custom"></i>
        <Typography className="title" variant="h5">
          GitHub
        </Typography>
      </a>
      <a
        href="https://www.facebook.com/piatro.marchanka"
        className="github-link"
        target="_blank"
        rel="noreferrer"
      >
        <Icon
          className="fa_custom"
          type="facebook"
          fill={mainColors.darkerGray}
        />
        <Typography className="title" variant="h5">
          Facebook
        </Typography>
      </a>
      <FeedbackForm />
    </RowCentered>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  flex-wrap: wrap;
`;

const RowCentered = styled(Row)`
  justify-content: space-between;
  flex-wrap: nowrap;

   > a, div {
    padding: 20px;
  }

  .github-link {
    display: flex;
    justify-content: center;
    color: ${mainColors.darkerGray};
    text-decoration: none;
    .title {
      font-size: 15px;
    }

    .fa_custom {
      font-size: 20px;
      margin-right: 5px;
      height: 20px;
      width: 20px;
    }
  }

  .facebook {
    height: 30px;
    width: 30px;
  }
`;
