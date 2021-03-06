import {
  ActionIcon,
  Button,
  Group,
  Text,
  Switch,
  Table,
  Title,
  Loader,
  Center,
  Box,
} from "@mantine/core";
import { Edit, Trash } from "tabler-icons-react";
import { Link } from "react-router-dom";
import { useModals } from "@mantine/modals";
import { IBike } from "../../shared/types/bike";
import { showNotification } from "@mantine/notifications";
import { useClient, useSelect, useUpdate } from "react-supabase";
import { Tables } from "../../shared/types/tables";
import ThreeDots from "../../shared/components/three-dots";

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
    const { data } = await client
      .from(Tables.Bikes)
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
      {fetching ? (
        <Center style={{ width: "100%" }}>
          <ThreeDots width={200} />
        </Center>
      ) : (
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
          <tbody>{rows}</tbody>
        </Table>
      )}
    </>
  );
};
