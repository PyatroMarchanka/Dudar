import React from "react";
import styled from "styled-components";
import { Icon } from "../global/Icon";
import { mainColors } from "../../utils/theme";
import { links } from "../../api/links";
import { useTranslation } from "react-i18next";
import GoogleAuth from "./GoogleLogin";

interface Props {}

export const LoginComponent = (props: Props) => {
  const { t } = useTranslation("translation");
  return (
    <div>
      <GoogleAuth />
      {/* <a href={links.login}>

        <GoogleButton>
          <Icon className="icon" type="google" />
          {t("login.googleLogin")}
        </GoogleButton>
      </a> */}
    </div>
  );
};

const GoogleButton = styled.button`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  float: left;
  width: 100%;
  height: 50px;
  border-radius: 2.5px;
  font-size: 17.5px !important;
  color: rgba(0, 0, 0, 0.54);
  letter-spacing: 0.27px;
  line-height: 50px;
  text-align: center;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  border: 1px solid #dadce0;
  background: ${mainColors.lightestGrey};
  cursor: pointer;

  &:hover {
    border-color: #d2e3fc;
    background: rgba(66, 133, 244, 0.04);
  }

  .icon {
    margin-right: 20px;
  }
`;
