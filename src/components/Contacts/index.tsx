import React from "react";
import styled from "styled-components";
import { FeedbackForm } from "../FeedbackForm";
import { Typography } from "@material-ui/core";
import { mainColors } from "../../utils/theme";
import { Icon } from "../global/Icon";

interface Props {
  color?: string;
}

export const Contacts = ({ color }: Props) => {
  return (
    <RowCentered>
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
          Piatro Marchanka
        </Typography>
      </a>
      <FeedbackForm color={color} />
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
  flex-wrap: wrap;

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
