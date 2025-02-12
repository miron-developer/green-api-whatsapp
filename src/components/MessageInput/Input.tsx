import { SubmitHandler, useForm } from "react-hook-form";
import { KeyboardEvent } from "react";
import { Button, TextField } from "@mui/material";

import { useAppDispatch } from "@/store";
import { sendMessage } from "@/store/slices/appSlice";

import "./style.scss";

type FormValues = {
  message: string;
};

export default function MessageInput() {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormValues>();

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(sendMessage({ message: data.message }));
    reset();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  return (
    <form
      className="messenger--input-wrapper"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        multiline
        label="Enter message"
        variant="standard"
        size="small"
        className="messenger--input form--input standard"
        error={!!errors.message}
        fullWidth
        placeholder="Enter message"
        {...register("message", {
          required: "Required field",
        })}
        onKeyDown={onKeyDown}
      />

      <Button
        className="messenger--btn green-btn"
        type="submit"
        variant="contained"
      >
        Send
      </Button>
    </form>
  );
}
