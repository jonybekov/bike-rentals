import { PaperProps } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-supabase";
import { AuthForm } from "../auth-form";
import { IAuthForm } from "../types";

export function Login(props: PaperProps<"div">) {
  const [{ fetching, user }, signIn] = useSignIn();
  const navigate = useNavigate();

  const handleLogin = ({ email, password }: IAuthForm) => {
    signIn({ email, password });
  };

  useEffect(() => {
    if (fetching) {
      return;
    }

    if (user) {
      navigate("/");
    }
  }, [user, fetching]);

  return <AuthForm type="login" loading={fetching} onSubmit={handleLogin} />;
}
