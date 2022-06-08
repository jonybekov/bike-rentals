import { Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Collection } from "../../../app/services/collections";
import { db } from "../../../app/services/firebase";
import { IUserForm } from "../../../shared/types/user";
import { UserForm } from "../user-form";

export function CreateUser() {
  const navigate = useNavigate();

  const handleCreateUser = async (data: IUserForm) => {
    // await addDoc(collection(db, Collection.Bikes), {
    //   model: data.model,
    //   color: data.color,
    //   location: data.location,
    // });

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
