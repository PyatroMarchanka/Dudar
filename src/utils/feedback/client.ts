import axios from "axios";

export enum FeedbackTypes {
  Bug = "bug",
  Request = "request",
}

export const telegramClient = async (message: {
  text: string;
  name: string;
  type: FeedbackTypes;
}) => {
  const chat = process.env.REACT_APP_CHAT_ID;
  const url = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: chat,
    parse_mode: "html",
    text: `Type: ${message.type}\nName: ${message.name}\nText: ${message.text}`,
  });
};
