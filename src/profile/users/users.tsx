import {
  ActionIcon,
  Button,
  Group,
  Text,
  Table,
  Box,
  Title,
  Switch,
  Center,
  Tooltip,
} from "@mantine/core";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Checklist, Edit, Trash } from "tabler-icons-react";
import { Link } from "react-router-dom";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { Filter, useClient, useSelect } from "react-supabase";
import { useAuth } from "../../app/contexts/auth-context";
import { IUser } from "../../shared/types/user";
import ThreeDots from "../../shared/components/three-dots";

export const Users = () => {
  const modals = useModals();
  const supabase = useClient();
  const { user } = useAuth();
  const [reservedUserIds, setReservedUserIds] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const filter: Filter<any> = useCallback(
    (query) => query.neq("role", 3).neq("id", user?.id),
    []
  );
  const [{ data, fetching }, reexecute] = useSelect("profiles", {
    columns: "id, display_name, email, role(name)",
    filter,
  });

  const handleToggle = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setLoading(true);
      const { data } = await supabase.from("reservations").select("*");
      setReservedUserIds([...new Set(data?.map((item) => item.userId) ?? [])]);
      setLoading(false);
    } else {
      setReservedUserIds(null);
    }
  };

  const users =
    reservedUserIds === null
      ? data
      : data?.filter((user) => reservedUserIds.includes(user.id));

  console.log(users, data);

  const deleteUser = async (userId: string) => {
    const { data } = await supabase.auth.api.deleteUser(userId);

    if (data) {
      showNotification({ message: "User deleted" });
      reexecute();
    }
  };

  const openConfirmModal = (user: IUser) =>
    modals.openConfirmModal({
      title: "Confirm action",
      children: (
        <Text size="sm">Do you want to delete {user.display_name}?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: () => deleteUser(user.id),
    });

  const rows = users?.map((element) => (
    <tr key={element.id}>
      <td>{element.id}</td>
      <td>{element.display_name}</td>
      <td>{element.email}</td>
      <td>{element.role.name}</td>

      <td>
        <Group spacing="sm">
          <Link to={`${element.id}/reservations`}>
            <Tooltip label="User reservations">
              <ActionIcon>
                <Checklist size={20} />
              </ActionIcon>
            </Tooltip>
          </Link>
          <Link to={`${element.id}/edit`}>
            <Tooltip label="Edit user">
              <ActionIcon>
                <Edit size={20} />
              </ActionIcon>
            </Tooltip>
          </Link>
          <ActionIcon onClick={openConfirmModal.bind(null, element)}>
            <Tooltip label="Delete user">
              <Trash size={20} />
            </Tooltip>
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      <Box sx={() => ({ display: "flex", justifyContent: "space-between" })}>
        <Title order={2}>Users</Title>
        <Switch
          onChange={handleToggle}
          readOnly={loading}
          label="Show users with reservations"
        />
        <Link to="add">
          <Button>Add User</Button>
        </Link>
      </Box>
      {loading || fetching ? (
        <Center style={{ width: "100%" }}>
          <ThreeDots width={200} />
        </Center>
      ) : (
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
      )}
    </>
  );
};
