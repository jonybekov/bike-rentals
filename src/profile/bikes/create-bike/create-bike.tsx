import { Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useClient } from "react-supabase";
import { IBikeForm } from "../../../shared/types/bike";
import { Tables } from "../../../shared/types/tables";
import { BikeForm } from "../bike-form";

export function CreateBike() {
  const navigate = useNavigate();
  const client = useClient();

  const handleCreateBike = async (formData: IBikeForm) => {
    const { data } = await client.from(Tables.Bikes).insert([
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
