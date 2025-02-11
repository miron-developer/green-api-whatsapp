import { Button, FormHelperText, TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

import { setAppState } from "@/store/slices/appSlice";
import { useAppDispatch } from "@/store";
import { validateGreenAPIUrl, validateOnlyDigits } from "@/utils/validations";

import "./style.scss";

type FormValues = {
  apiURL: string;
  idInstance: string;
  apiTokenInstance: string;
  phoneNumber: string;
};

export default function EnterForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<FormValues>({ shouldUnregister: true });

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(
      setAppState({
        ...data,
        isLogged: true,
      }),
    );
  };

  return (
    <form className="enter-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="enter-form--input-wrapper">
        <TextField
          label="Enter apiURL"
          variant="standard"
          size="small"
          className="enter-form--input form--input standard"
          error={!!errors.apiURL}
          fullWidth
          {...register("apiURL", {
            required: "Required field",
            validate: validateGreenAPIUrl,
            value:
              process.env.REACT_APP_API_URL ||
              "https://{your-id}.api.greenapi.com",
          })}
        />
        <FormHelperText error={!!errors.apiURL} id="component-error-text">
          {errors.apiURL?.message}
        </FormHelperText>
      </div>

      <div className="enter-form--input-wrapper">
        <TextField
          label="Enter idInstance"
          variant="standard"
          size="small"
          className="enter-form--input form--input standard"
          placeholder="xxx3189xxx"
          error={!!errors.idInstance}
          fullWidth
          {...register("idInstance", {
            required: "Required field",
            validate: validateOnlyDigits,
            value: process.env.REACT_APP_ID_INSTANCE || "xxx3189xxx",
          })}
        />
        <FormHelperText error={!!errors.idInstance} id="component-error-text">
          {errors.idInstance?.message}
        </FormHelperText>
      </div>

      <div className="enter-form--input-wrapper">
        <TextField
          label="Enter apiTokenInstance"
          variant="standard"
          size="small"
          className="enter-form--input form--input standard"
          placeholder="token"
          error={!!errors.apiTokenInstance}
          fullWidth
          {...register("apiTokenInstance", {
            required: "Required field",
            value: process.env.REACT_APP_API_TOKEN_INSTANCE || "",
          })}
        />
        <FormHelperText
          error={!!errors.apiTokenInstance}
          id="component-error-text"
        >
          {errors.apiTokenInstance?.message}
        </FormHelperText>
      </div>

      <div className="enter-form--input-wrapper">
        <TextField
          label="Enter phone number of your chatting person"
          variant="standard"
          size="small"
          className="enter-form--input form--input standard"
          type="tel"
          inputMode="tel"
          error={!!errors.phoneNumber}
          fullWidth
          {...register("phoneNumber", {
            required: "Required field",
            validate: validateOnlyDigits,
            value: process.env.REACT_APP_PHONE_NUMBER || "70000000000",
          })}
        />
        <FormHelperText error={!!errors.phoneNumber} id="component-error-text">
          {errors.phoneNumber?.message}
        </FormHelperText>
      </div>

      <Button
        className="enter-form--btn green-btn"
        type="submit"
        variant="contained"
      >
        Submit
      </Button>
    </form>
  );
}
