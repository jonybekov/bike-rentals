import { AuthForm } from "../auth-form";
import { IAuthForm } from "../types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useClient, useSignUp } from "react-supabase";

export function Register() {
  const navigate = useNavigate();
  const [{ fetching, user }, signUp] = useSignUp();
  const supabase = useClient();
  const USER_ROLE_ID = 1;

  const handleRegister = async ({ name, email, password }: IAuthForm) => {
    const { user } = await signUp({
      email,
      password,
      display_name: name,
    } as any);

    if (user) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          display_name: name,
          email,
          role: USER_ROLE_ID,
        },
      ]);
    }
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
