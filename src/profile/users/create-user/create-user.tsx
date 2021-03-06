import { Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useClient, useSignUp } from "react-supabase";
import { IUserForm } from "../../../shared/types/user";
import { UserForm } from "../user-form";

export function CreateUser() {
  const navigate = useNavigate();

  const [{ error, fetching, session, user }, signUp] = useSignUp();
  const supabase = useClient();
  const SIMPLE_USER_ROLE_ID = 1;

  const handleCreateUser = async ({
    display_name,
    email,
    password,
    role,
  }: IUserForm) => {
    const { user, error } = await signUp({
      email,
      password,
    });

    if (error) {
      return showNotification({ message: error?.message, color: "red" });
    }

    console.log(user);

    if (user) {
      const { data: newUserRole } = await supabase.from("profiles").insert([
        {
          id: user.id,
          display_name,
          email,
          role: role.id,
        },
      ]);

      console.log(newUserRole);
    }
    showNotification({ message: "Item has been created" });
    navigate("/profile/users");
  };

  return (
    <>
      <Title mb="lg" order={2}>
        Add User
      </Title>
      <UserForm onSubmit={handleCreateUser} />
    </>
  );
}
