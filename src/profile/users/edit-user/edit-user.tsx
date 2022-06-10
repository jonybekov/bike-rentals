import { Loader, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Filter, useSelect, useUpdate } from "react-supabase";
import { IUser, IUserForm } from "../../../shared/types/user";
import { UserForm } from "../user-form";

export function EditUser() {
  const { userId = "" } = useParams();
  const navigate = useNavigate();

  const filter: Filter<any> = useCallback(
    (query: any) => query.eq("id", userId).single(),
    []
  );

  const [{ data, fetching }] = useSelect<IUserForm>("profiles", {
    columns: "id, display_name, email, role(name)",
    filter,
  });
  const user = data as unknown as IUser;
  const [_, update] = useUpdate("profiles");

  const handleEditUser = async (formData: IUserForm) => {
    console.log(formData);

    await update(
      {
        display_name: formData.display_name,
        role: formData.role.id,
      },
      (query) => query.eq("id", userId)
    );

    showNotification({ message: "User edited!" });
    navigate("/profile/users");
  };

  if (fetching) return <Loader />;

  return (
    <>
      <Title mb="lg" order={2}>
        Edit {user?.display_name}
      </Title>
      <UserForm mode="edit" initialValues={user} onSubmit={handleEditUser} />;
    </>
  );
}
