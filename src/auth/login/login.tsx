import { PaperProps } from "@mantine/core";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword, auth } from "../../app/services/firebase";
import { AuthForm } from "../auth-form";
import { IAuthForm } from "../types";

export function Login(props: PaperProps<"div">) {
  const handleLogin = ({ email, password }: IAuthForm) => {
    logInWithEmailAndPassword(email, password);
  };

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/profile");
  }, [user, loading]);

  return <AuthForm type="login" loading={loading} onSubmit={handleLogin} />;
}
