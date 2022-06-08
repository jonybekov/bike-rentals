import { showNotification } from "@mantine/notifications";
import { addDoc, collection, doc } from "firebase/firestore";
import { Collection } from "../../app/services/collections";
import { db } from "../../app/services/firebase";
import { IBikeForm } from "../../shared/types/bike";
import { BikeForm } from "../bike-form";

export function EditBike() {
  const handleEditBike = async (data: IBikeForm) => {
    await addDoc(collection(db, Collection.Bikes), {
      model: data.model,
      color: data.color,
      location: data.location,
    });

    alert("Bike edited!");
  };

  return <BikeForm onSubmit={handleEditBike} />;
}
