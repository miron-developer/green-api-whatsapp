import { useSelector } from "react-redux";
import { useEffect } from "react";
import classNames from "classnames";

import { useAppDispatch, type RootState } from "@/store";
import { getAccountData } from "@/store/slices/appSlice";
import { EnterForm } from "@/components/EnterForm";
import { Messenger } from "@/components/Messenger";

import "./App.scss";

function App() {
  const { isLogged } = useSelector((state: RootState) => state.app);

  const dispatch = useAppDispatch();

  // get account data on logged
  useEffect(() => {
    if (!isLogged) return;
    dispatch(getAccountData());
  }, [isLogged, dispatch]);

  return (
    <div
      className={classNames({
        app: true,
        "app__enter-form": !isLogged,
        app__logged: isLogged,
      })}
    >
      {!isLogged ? (
        <EnterForm key="enter-form" />
      ) : (
        <Messenger key="messenger" />
      )}
    </div>
  );
}

export default App;
