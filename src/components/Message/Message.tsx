import { ListItem, ListItemText, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { type RootState } from "@/store";

import "./style.scss";

export default function Message({
  senderData: { sender, senderName },
  messageData: {
    textMessageData: { textMessage },
  },
}: ChatMessage) {
  const { phoneNumber } = useSelector((state: RootState) => state.app);

  const isMe = sender !== `${phoneNumber}@c.us`;

  return (
    <ListItem
      sx={{
        justifyContent: isMe ? "flex-end" : "flex-start",
      }}
      className="messenger--message"
    >
      <ListItemText
        sx={{
          width: "max-content",
          flex: "unset",
          textAlign: isMe ? "right" : "flex-start",
        }}
        primary={senderName}
        secondary={
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "white", display: "inline" }}
          >
            {textMessage}
          </Typography>
        }
      />
    </ListItem>
  );
}
