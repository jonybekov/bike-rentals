import { Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useClient } from "react-supabase";
import { Collection } from "../../../app/services/collections";
import { db } from "../../../app/services/firebase";
import { IBikeForm } from "../../../shared/types/bike";
import { BikeForm } from "../bike-form";

export function CreateBike() {
  const navigate = useNavigate();
  const client = useClient();

  const handleCreateBike = async (formData: IBikeForm) => {
    const { data } = await client.from(Collection.Bikes).insert([
      {
        model: formData.model.id,
        color: formData.color.id,
        location: formData.location.id,
      },
    ]);

    if (data) {
      showNotification({ message: "Item has been created" });
      navigate("/profile/bikes");
    }
  };

  return (
    <>
      <Title mb="lg" order={2}>
        Add bike
      </Title>
      <BikeForm onSubmit={handleCreateBike} />
    </>
  );
}
