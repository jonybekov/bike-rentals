import {
  auth,
  registerWithEmailAndPassword,
} from "../../app/services/firebase";
import { AuthForm } from "../auth-form";
import { useAuthState } from "react-firebase-hooks/auth";
import { IAuthForm } from "../types";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

export function Register() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleRegister = ({ name, email, password }: IAuthForm) => {
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;

    if (user) {
      showNotification({ title: "Successfully registered!", message: "" });
      navigate("/", { replace: true });
    }
  }, [user, loading]);

  return (
    <AuthForm type="register" loading={loading} onSubmit={handleRegister} />
  );
}
