import { Loader, Title } from "@mantine/core";
import { useForceUpdate } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Collection } from "../../../app/services/collections";
import { db } from "../../../app/services/firebase";
import { IBikeForm } from "../../../shared/types/bike";
import { IUserForm } from "../../../shared/types/user";
import { UserForm } from "../user-form";

export function EditUser() {
  const { userId = "" } = useParams();
  const [user, setUser] = useState<IUserForm>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBike = async () => {
      setLoading(true);
      const docSnapshot = await getDoc(doc(db, Collection.Bikes, userId));

      const userData = docSnapshot.data() as IUserForm;
      setUser({
        ...userData,
      });
      setLoading(false);
    };

    getBike();
  }, []);

  const handleEditUser = async (data: IUserForm) => {
    // await updateDoc(doc(db, Collection.Bikes, userId), {
    //   model: data,
    //   color: data.color,
    //   location: data.location,
    // });

    showNotification({ message: "User edited" });
  };

  if (loading) return <Loader />;

  return (
    <>
      <Title mb="lg" order={2}>
        Edit {user?.displayName}
      </Title>
      <UserForm initialValues={user} onSubmit={handleEditUser} />;
    </>
  );
}
