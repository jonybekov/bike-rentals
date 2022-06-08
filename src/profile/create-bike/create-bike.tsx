import { showNotification } from "@mantine/notifications";
import { addDoc, collection, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Collection } from "../../app/services/collections";
import { db } from "../../app/services/firebase";
import { IBikeForm } from "../../shared/types/bike";
import { BikeForm } from "../bike-form";

export function CreateBike() {
  const navigate = useNavigate();

  const handleCreateBike = async (data: IBikeForm) => {
    await addDoc(collection(db, Collection.Bikes), {
      model: data.model,
      color: data.color,
      location: data.location,
    });

    showNotification({ message: "Item has been created" });
    navigate("/profile/bikes");
  };

  return <BikeForm onSubmit={handleCreateBike} />;
}
