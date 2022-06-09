import { Container, Title, Grid, Center, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useClient } from "react-supabase";
import { useAuth } from "../app/contexts/auth-context";
import { Collection } from "../app/services/collections";
import { auth, db } from "../app/services/firebase";
import { BikeCard } from "../shared/components/bike-card";
import ThreeDots from "../shared/components/three-dots";
import { IBike } from "../shared/types/bike";
import { IReservation } from "../shared/types/reservation";

export function MyReservations() {
  const [loading, setLoading] = useState<boolean>(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const { user } = useAuth();
  const supabase = useClient();
  const modals = useModals();

  const getReservations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reservations")
      .select(
        "id, bike:bikeId ( id, model (name), color (name), location (name)), startDate, endDate"
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
    <Container>
      <Title mt="lg" sx={{ marginBottom: 24 }}>
        My reservations
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
    </Container>
  );
}
