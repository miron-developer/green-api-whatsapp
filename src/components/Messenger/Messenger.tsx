import { Header } from "@/components/Header";
import { Messages } from "@/components/Messages";
import { Input as MessageInput } from "@/components/MessageInput";

import "./style.scss";

export default function Messenger() {
  return (
    <div className="messenger">
      <Header />
      <Messages />
      <MessageInput />
    </div>
  );
}
