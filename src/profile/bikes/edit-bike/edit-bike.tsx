import { Loader, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Collection } from "../../../app/services/collections";
import { db } from "../../../app/services/firebase";
import { IBikeForm } from "../../../shared/types/bike";
import { BikeForm } from "../bike-form";

export function EditBike() {
  const { bikeId = "" } = useParams();
  const [bike, setBike] = useState<IBikeForm>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getBike = async () => {
      setLoading(true);
      const docSnapshot = await getDoc(doc(db, Collection.Bikes, bikeId));

      const bikeData = docSnapshot.data() as IBikeForm;
      setBike({
        ...bikeData,
      });
      setLoading(false);
    };

    getBike();
  }, []);

  const handleEditBike = async (data: IBikeForm) => {
    await updateDoc(doc(db, Collection.Bikes, bikeId), {
      model: data.model,
      color: data.color,
      location: data.location,
    });

    showNotification({ message: "Bike edited!" });
    navigate("/profile/bikes");
  };

  if (loading) return <Loader />;

  return (
    <>
      <Title mb="lg" order={2}>
        Edit {bike?.model.name}
      </Title>
      <BikeForm initialValues={bike} onSubmit={handleEditBike} />;
    </>
  );
}
