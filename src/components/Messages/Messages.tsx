import { List } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

import { Message } from "@/components/Message";
import { getMessageNotification } from "@/store/slices/appSlice";
import { type RootState, useAppDispatch } from "@/store";

import "./style.scss";

export default function Messages() {
  const listRef = useRef<HTMLUListElement>(null);
  const { messages } = useSelector((state: RootState) => state.app);

  const dispatch = useAppDispatch();

  // get messages every 5s
  useEffect(() => {
    dispatch(getMessageNotification());
  }, [dispatch]);

  // keep scrolled to last
  useEffect(() => {
    if (!listRef.current) return;

    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  return (
    <List
      className="messenger--messages"
      sx={{ width: "100%", overflow: "auto" }}
      ref={listRef}
    >
      {messages.map((m) => {
        return <Message key={m.idMessage} {...m} />;
      })}
    </List>
  );
}
