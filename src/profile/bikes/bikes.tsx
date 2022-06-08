import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Text,
  Switch,
  Table,
} from "@mantine/core";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../app/services/firebase";
import { Edit, Trash } from "tabler-icons-react";
import { Link } from "react-router-dom";
import { useModals } from "@mantine/modals";
import { IBike } from "../../shared/types/bike";
import { Collection } from "../../app/services/collections";
import { showNotification } from "@mantine/notifications";

export const Bikes = () => {
  const [bikes, setBikes] = useState<IBike[]>([]);
  const modals = useModals();

  const toggleAvailability = async (bikeId: string, value: boolean) => {
    return updateDoc(doc(db, Collection.Bikes, bikeId), {
      available: value,
    }).then(() => {
      showNotification({ message: "Item updated" });
    });
  };

  const deleteBike = async (bikeId: string) => {
    return deleteDoc(doc(db, Collection.Bikes, bikeId)).then(() => {
      showNotification({ message: "Item deleted" });
    });
  };

  const openConfirmModal = (bike: IBike) =>
    modals.openConfirmModal({
      title: "Confirm action",
      children: <Text size="sm">Do you want to delete {bike.model.name}?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteBike(bike.id),
    });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bikes"), (querySnapshot) => {
      const bikes = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IBike)
      );

      setBikes(bikes);
    });

    return () => unsubscribe();
  }, []);

  const rows = bikes.map((element) => (
    <tr key={element.id}>
      <td>{element.model.name}</td>
      <td>{element.color.name}</td>
      <td>{element.location.name}</td>
      <td>
        <Switch
          defaultChecked={element.available}
          onChange={toggleAvailability.bind(
            null,
            element.id,
            !Boolean(element.available)
          )}
        />
      </td>
      <td>
        <Group spacing="sm">
          <Link to={`${element.id}/edit`}>
            <ActionIcon>
              <Edit size={20} />
            </ActionIcon>
          </Link>
          <ActionIcon onClick={openConfirmModal.bind(null, element)}>
            <Trash size={20} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      <Grid justify="flex-end" mb="md">
        <Link to="add">
          <Button>Add Bike</Button>
        </Link>
      </Grid>
      <Table>
        <thead>
          <tr>
            <th>Model name</th>
            <th>Color</th>
            <th>Location</th>
            <th>Avialability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
