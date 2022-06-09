import {
  auth,
  registerWithEmailAndPassword,
} from "../../app/services/firebase";
import { AuthForm } from "../auth-form";
import { useAuthState } from "react-firebase-hooks/auth";
import { IAuthForm } from "../types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useSignUp } from "react-supabase";

export function Register() {
  const navigate = useNavigate();
  const [{ error, fetching, session, user }, signUp] = useSignUp();

  const handleRegister = ({ name, email, password }: IAuthForm) => {
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (fetching) return;

    if (user) {
      showNotification({ title: "Successfully registered!", message: "" });
      navigate("/", { replace: true });
    }
  }, [user, user]);

  return (
    <AuthForm type="register" loading={fetching} onSubmit={handleRegister} />
  );
}
