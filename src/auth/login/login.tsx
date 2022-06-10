import { PaperProps } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-supabase";
import { AuthForm } from "../auth-form";
import { IAuthForm } from "../types";

export function Login(props: PaperProps<"div">) {
  const [{ fetching, user, error }, signIn] = useSignIn();
  const navigate = useNavigate();

  const handleLogin = ({ email, password }: IAuthForm) => {
    signIn({ email, password });
  };

  useEffect(() => {
    if (fetching) {
      return;
    }

    if (error) {
      showNotification({ message: error.message, color: "red" });
    }

    if (user) {
      navigate("/");
    }
  }, [user, fetching, error]);

  return <AuthForm type="login" loading={fetching} onSubmit={handleLogin} />;
}
