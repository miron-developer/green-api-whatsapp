import { useSelector } from "react-redux";
import { Button } from "@mui/material";

import { useAppDispatch, type RootState } from "@/store";
import { signOut } from "@/store/slices/appSlice";

import "./style.scss";

export default function Header() {
  const { phoneNumber } = useSelector((state: RootState) => state.app);

  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <header className="header">
      <div>Phone Number: {phoneNumber}</div>
      <Button
        type="submit"
        color="error"
        variant="contained"
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </header>
  );
}
