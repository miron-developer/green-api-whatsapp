// send message
interface SendMessage {
  message: string;
}

interface SendMessageResponse {
  idMessage: string;
}
// end

// receive notification block
interface InstanceData {
  idInstance: number;
  wid: string;
  typeInstance: string;
}

interface SenderData {
  // chatId: string;
  sender: string;
  senderName: string;
  // senderContactName: string;
}

interface TextMessageData {
  textMessage: string;
}

interface MessageData {
  // typeMessage: string;
  textMessageData: TextMessageData;
}

interface ChatMessage {
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

interface ReceivedNotificationBody extends ChatMessage {
  // typeWebhook: string;
  // instanceData: InstanceData;
  // timestamp: number;
}

interface ReceivedNotification {
  receiptId: number;
  body: ReceivedNotificationBody;
}

// end

// delete message
interface DeleteMessageNotification {
  receiptId: number;
}

interface DeleteMessageNotificationResponse {
  result: boolean;
}
// end

type MessagerState =
  | "OK"
  | "PENDING_RECEIVING"
  | "FAILED_TO_RECEIVE_NOTIFICATION"
  | "FAILED_TO_DELETE_NOTIFICATION";
