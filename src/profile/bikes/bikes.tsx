import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Text,
  Switch,
  Table,
  Title,
  Loader,
  Center,
  Box,
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
import { useClient, useSelect, useUpdate } from "react-supabase";

export const Bikes = () => {
  const client = useClient();
  const [{ data, fetching }, reexecute] = useSelect("bikes", {
    columns: "id, model ( name ), color ( name ), location ( name ), available",
  });

  const [_, update] = useUpdate("bikes");

  const modals = useModals();

  const toggleAvailability = async (bikeId: string, value: boolean) => {
    return update(
      {
        available: value,
      },
      (query) => query.eq("id", bikeId)
    ).then(() => {
      showNotification({ message: "Item updated" });
    });
  };

  const deleteBike = async (bikeId: string) => {
    const { data, error } = await client
      .from(Collection.Bikes)
      .delete()
      .match({ id: bikeId });

    if (data) {
      showNotification({ message: "Item deleted" });
      reexecute();
    }
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

  const rows = data?.map((element) => (
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
      <Box sx={() => ({ display: "flex", justifyContent: "space-between" })}>
        <Title order={2}>Bikes</Title>

        <Link to="add">
          <Button>Add Bike</Button>
        </Link>
      </Box>
      <Table mt="lg">
        <thead>
          <tr>
            <th>Model name</th>
            <th>Color</th>
            <th>Location</th>
            <th>Avialability</th>
            <th>Actions</th>
          </tr>
        </thead>
        {fetching ? (
          <tbody>
            <tr>
              <Center style={{ width: "100%" }}>
                <Loader />
              </Center>
            </tr>
          </tbody>
        ) : (
          <tbody>{rows}</tbody>
        )}
      </Table>
    </>
  );
};
