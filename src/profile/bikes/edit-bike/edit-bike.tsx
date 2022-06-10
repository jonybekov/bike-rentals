import { Loader, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Filter, useSelect, useUpdate } from "react-supabase";
import { IBike, IBikeForm } from "../../../shared/types/bike";
import { BikeForm } from "../bike-form";

export function EditBike() {
  const { bikeId = "" } = useParams();
  const navigate = useNavigate();

  const filter: Filter<any> = useCallback(
    (query: any) => query.eq("id", bikeId).single(),
    []
  );

  const [{ data, fetching }] = useSelect<IBike>("bikes", {
    columns: "id, model ( name ), color ( name ), location ( name ), available",
    filter,
  });
  const bike = data as unknown as IBike;
  const [_, update] = useUpdate("bikes");

  const handleEditBike = async (formData: IBikeForm) => {
    await update(
      {
        model: formData.model.id,
        color: formData.color.id,
        location: formData.location.id,
      },
      (query) => query.eq("id", bikeId)
    );

    showNotification({ message: "Bike edited!" });
    navigate("/profile/bikes");
  };

  if (fetching) return <Loader />;

  return (
    <>
      <Title mb="lg" order={2}>
        Edit {bike?.model?.name}
      </Title>
      <BikeForm
        initialValues={data as unknown as IBikeForm}
        onSubmit={handleEditBike}
      />
      ;
    </>
  );
}
