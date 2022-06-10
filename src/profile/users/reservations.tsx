import { Loader } from "@mantine/core";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { Filter, useSelect } from "react-supabase";
import { UserReservations } from "../../shared/components/user-reservations";
import { IUser, IUserForm } from "../../shared/types/user";

export function Reservations() {
  const { userId = "" } = useParams();

  const filter: Filter<any> = useCallback(
    (query: any) => query.eq("id", userId).single(),
    []
  );

  const [{ data, fetching }] = useSelect<IUserForm>("profiles", {
    columns: "id, display_name, email, role(name)",
    filter,
  });
  const user = data as unknown as IUser;

  if (fetching) return <Loader />;

  return <UserReservations user={user} />;
}
