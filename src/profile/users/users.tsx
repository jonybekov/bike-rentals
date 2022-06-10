import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Text,
  Switch,
  Table,
  Box,
  Title,
} from "@mantine/core";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../../app/services/firebase";
import { Checklist, Edit, Trash } from "tabler-icons-react";
import { Link } from "react-router-dom";
import { useModals } from "@mantine/modals";
import { IBike } from "../../shared/types/bike";
import { Collection } from "../../app/services/collections";
import { showNotification } from "@mantine/notifications";
import { Filter, useClient, useSelect } from "react-supabase";
import { useAuth } from "../../app/contexts/auth-context";

export const Users = () => {
  const modals = useModals();
  const supabase = useClient();
  const { user } = useAuth();

  const filter: Filter<any> = useCallback(
    (query) => query.neq("role", 3).neq("id", user?.id),
    []
  );
  const [{ data, fetching }, reexecute] = useSelect("profiles", {
    columns: "id, display_name, email, role(name)",
    filter,
  });

  const deleteUser = async (userId: string) => {
    const { data } = await supabase.auth.api.deleteUser(userId);

    if (data) {
      showNotification({ message: "User deleted" });
      reexecute();
    }
  };

  const openConfirmModal = (user: any) =>
    modals.openConfirmModal({
      title: "Confirm action",
      children: (
        <Text size="sm">Do you want to delete {user.display_name}?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteUser(user.id),
    });

  const rows = data?.map((element) => (
    <tr key={element.id}>
      <td>{element.id}</td>
      <td>{element.display_name}</td>
      <td>{element.email}</td>
      <td>{element.role.name}</td>

      <td>
        <Group spacing="sm">
          <Link to={`${element.id}/reservations`}>
            <ActionIcon>
              <Checklist size={20} />
            </ActionIcon>
          </Link>
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
        <Title order={2}>Users</Title>

        <Link to="add">
          <Button>Add User</Button>
        </Link>
      </Box>
      <Table mt="lg">
        <thead>
          <tr>
            <th>Id</th>
            <th>Display Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
