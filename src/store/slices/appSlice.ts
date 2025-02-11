import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { type RootState } from "@/store";

const storageName = "ga-app-state";
const fromStorage = JSON.parse(
  window.localStorage.getItem(storageName) || "{}",
);

const uniqueMessageIds = new Set();
const deleteMessageIds = new Set();

interface AppState {
  apiURL: string;
  idInstance: string;
  apiTokenInstance: string;
  phoneNumber: string;
  isLogged: boolean;
  messengerState: MessagerState;
  myNumber: string;
  myId: string;

  messages: ChatMessage[];
}

const initialState: AppState = {
  apiURL: "",
  idInstance: "",
  apiTokenInstance: "",
  phoneNumber: "",
  isLogged: false,
  messengerState: "OK",
  myNumber: "",
  myId: "",
  ...fromStorage,

  messages: [], // tried use Set, ask external plugin and so on, so, added filtering
};

export const getAccountData = createAsyncThunk(
  "app/getAccountData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const url =
        "{{apiUrl}}/waInstance{{idInstance}}/getSettings/{{apiTokenInstance}}"
          .replace("{{apiUrl}}", state.app.apiURL)
          .replace("{{idInstance}}", state.app.idInstance)
          .replace("{{apiTokenInstance}}", state.app.apiTokenInstance);

      const resp = await axios.get(url);
      if (resp.status > 300 || !resp.data.wid) {
        throw new Error("get config error");
      }

      return resp.data.wid.replace("@c.us", "");
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getMessageNotification = createAsyncThunk(
  "app/getMessageNotification",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as RootState;
      const url =
        "{{apiUrl}}/waInstance{{idInstance}}/receiveNotification/{{apiTokenInstance}}"
          .replace("{{apiUrl}}", state.app.apiURL)
          .replace("{{idInstance}}", state.app.idInstance)
          .replace("{{apiTokenInstance}}", state.app.apiTokenInstance);

      const resp = await axios.get(url);

      if (resp.status >= 300) throw new Error("network error");

      // keep getting new messages + add some timeout
      setTimeout(() => {
        dispatch(getMessageNotification());
      }, 300);

      if (!resp.data) {
        return {} as ReceivedNotification;
      }

      const d = resp.data as ReceivedNotification;

      // if not deleted -> delete the getted message
      if (!deleteMessageIds.has(d.receiptId)) {
        dispatch(deleteMessageNotification({ receiptId: d.receiptId }));
      }

      return d;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteMessageNotification = createAsyncThunk(
  "app/deleteMessageNotification",
  async (
    { receiptId }: DeleteMessageNotification,
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;

      const url =
        "{{apiUrl}}/waInstance{{idInstance}}/deleteNotification/{{apiTokenInstance}}/{{receiptId}}"
          .replace("{{apiUrl}}", state.app.apiURL)
          .replace("{{idInstance}}", state.app.idInstance)
          .replace("{{apiTokenInstance}}", state.app.apiTokenInstance)
          .replace("{{receiptId}}", receiptId.toString());

      const resp = await axios(url, {
        method: "DELETE",
      });
      if (!(resp.data as DeleteMessageNotificationResponse)) {
        throw new Error("not deleted");
      }

      return receiptId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "app/sendMessage",
  async ({ message }: SendMessage, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const url =
        "{{apiUrl}}/waInstance{{idInstance}}/sendMessage/{{apiTokenInstance}}"
          .replace("{{apiUrl}}", state.app.apiURL)
          .replace("{{idInstance}}", state.app.idInstance)
          .replace("{{apiTokenInstance}}", state.app.apiTokenInstance);

      const resp = await axios<SendMessageResponse>(url, {
        method: "POST",
        data: {
          chatId: `${state.app.phoneNumber}@c.us`,
          message,
        },
      });

      return {
        idMessage: resp.data.idMessage,
        senderData: {
          sender: state.app.myId,
          senderName: "Me",
        },
        messageData: {
          textMessageData: { textMessage: message },
        },
      } as ChatMessage;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppState(state, action) {
      Object.assign(state, action.payload);
      window.localStorage.setItem(storageName, JSON.stringify(state));
    },
    signOut() {
      window.localStorage.removeItem(storageName);
      window.location.reload();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAccountData.fulfilled, (state, action) => {
        state.myNumber = action.payload;
        state.myId = `${action.payload}@c.us`;
      })
      .addCase(getAccountData.rejected, () => {
        window.localStorage.removeItem(storageName);
        window.location.reload();
      })
      .addCase(getMessageNotification.pending, (state) => {
        state.messengerState = "PENDING_RECEIVING";
      })
      .addCase(getMessageNotification.fulfilled, (state, action) => {
        const payload = action.payload as ReceivedNotification;
        if (!payload.receiptId || !payload.body.senderData) return;

        // set only if from sender
        if (payload.body.senderData.sender === `${state.phoneNumber}@c.us`) {
          // if unique
          if (!uniqueMessageIds.has(payload.body.idMessage)) {
            uniqueMessageIds.add(payload.body.idMessage);
            state.messages.push(payload.body);
          }
        }
        state.messengerState = "OK";
      })
      .addCase(getMessageNotification.rejected, (state) => {
        state.messengerState = "FAILED_TO_RECEIVE_NOTIFICATION";
      })
      .addCase(deleteMessageNotification.fulfilled, (state, action) => {
        state.messengerState = "OK";
        // deleteMessageIds.clear();
        deleteMessageIds.add(action.payload);
      })
      .addCase(deleteMessageNotification.rejected, (state) => {
        state.messengerState = "FAILED_TO_DELETE_NOTIFICATION";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setAppState, signOut } = appSlice.actions;

export default appSlice.reducer;
