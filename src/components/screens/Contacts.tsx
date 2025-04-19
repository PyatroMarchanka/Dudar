import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { mainColors } from "../../utils/theme";
import { Icon } from "../global/Icon";
import { Navbar } from "../global/Navbar";
import { mediaQueries } from "../../constants/style";
import { FeedbackForm } from "../FeedbackForm";
import InstagramIcon from "@material-ui/icons/Instagram";
import EmailIcon from "@material-ui/icons/Email";

export const ContactsPage = () => {
  return (
    <Container>
      <Navbar />
      <Content>
        <Title variant="h2">Get in Touch</Title>
        <Subtitle variant="h5">Connect with us through social media or send us a message</Subtitle>
        
        <SocialLinks>
          <SocialLink
            href="https://www.facebook.com/piatro.marchanka"
            target="_blank"
            rel="noreferrer"
          >
            <Icon type="facebook" fill={mainColors.darkerGray} />
            <Typography variant="h6">Facebook</Typography>
            <Typography variant="body2">Piatro Marchanka</Typography>
          </SocialLink>

          <SocialLink
            href="https://www.instagram.com/piatrulia"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon style={{ fontSize: 40, color: mainColors.darkerGray }} />
            <Typography variant="h6">Instagram</Typography>
            <Typography variant="body2">@dudahero</Typography>
          </SocialLink>

          <SocialLink href="mailto:karotkavichy@gmail.com">
            <EmailIcon style={{ fontSize: 40, color: mainColors.darkerGray }} />
            <Typography variant="h6">Email</Typography>
            <Typography variant="body2">karotkavichy@gmail.com</Typography>
          </SocialLink>
          <SocialLink href="mailto:karotkavichy@gmail.com">
            <EmailIcon style={{ fontSize: 40, color: mainColors.darkerGray }} />
            <Typography variant="h6"> Send us a Message</Typography>
            <FeedbackForm />
          </SocialLink>
        </SocialLinks>
      </Content>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  background-color: ${mainColors.lightestGrey};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: ${mediaQueries.mobile}) {
    padding: 1rem;
  }
`;

const Title = styled(Typography)`
  text-align: center;
  color: ${mainColors.darkerGray};
  margin-bottom: 1rem;
  font-weight: 700;

  @media (max-width: ${mediaQueries.mobile}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(Typography)`
  text-align: center;
  color: ${mainColors.darkerGray};
  margin-bottom: 3rem;

  @media (max-width: ${mediaQueries.mobile}) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
`;

const SocialLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: ${mediaQueries.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const SocialLink = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: ${mainColors.darkerGray};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 40px;
    height: 40px;
    margin-bottom: 1rem;
  }

  h6 {
    color: ${mainColors.darkerGray};
    margin-bottom: 0.5rem;
  }

  @media (max-width: ${mediaQueries.mobile}) {
    padding: 1.5rem;
  }
`;

const FeedbackSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .feedback-title {
    text-align: center;
    color: ${mainColors.darkerGray};
    margin-bottom: 2rem;
  }

  @media (max-width: ${mediaQueries.mobile}) {
    padding: 1.5rem;
    
    .feedback-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }
`; 