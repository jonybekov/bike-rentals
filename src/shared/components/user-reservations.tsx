import { Title, Grid, Center, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useClient } from "react-supabase";
import { IUser } from "../types/user";
import { BikeCard } from "./bike-card";
import ThreeDots from "./three-dots";

interface UserReservationsProps {
  user: IUser | null;
  title?: string;
}

export function UserReservations({ user, title }: UserReservationsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const supabase = useClient();
  const modals = useModals();

  const getReservations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reservations")
      .select(
        "id, bike:bike_id ( id, model (name), color (name), location (name), avg_rate), start_date, end_date"
      )
      .eq("userId", user?.id);

    setReservations(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      getReservations();
    }
  }, [user]);

  const cancelReservation = async (reservationId: string) => {
    await supabase.from("reservations").delete().match({ id: reservationId });

    showNotification({ message: "Successfully cancelled" });
    getReservations();
  };

  const openCancellationModal = (reservationId: string) => {
    modals.openConfirmModal({
      title: "Cancel reservation",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to cancel your reservation?</Text>
      ),
      labels: { confirm: "Yes", cancel: "No" },
      confirmProps: { color: "red" },
      onConfirm: () => cancelReservation(reservationId),
    });

    return Promise.resolve();
  };

  return (
    <>
      <Title mt="lg" sx={{ marginBottom: 24 }}>
        {title ? title : `${user?.display_name} Reservations`}
      </Title>

      <Grid>
        {loading ? (
          <Center style={{ width: "100%" }}>
            <ThreeDots />
          </Center>
        ) : !reservations || !reservations.length ? (
          <Center style={{ width: "100%" }} py={100}>
            <Title order={3} sx={() => ({ fontWeight: "normal" })}>
              No reservations yet
            </Title>
          </Center>
        ) : (
          reservations.map((reservation) => (
            <Grid.Col span={4} key={reservation.id}>
              <BikeCard
                period={[reservation.startDate, reservation.endDate]}
                bike={reservation.bike}
                action="cancel"
                onClickAction={openCancellationModal.bind(null, reservation.id)}
              />
            </Grid.Col>
          ))
        )}
      </Grid>
    </>
  );
}
