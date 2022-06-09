import { Container, Title, Grid, Center, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
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
import { Collection } from "../app/services/collections";
import { auth, db } from "../app/services/firebase";
import { BikeCard } from "../shared/components/bike-card";
import ThreeDots from "../shared/components/three-dots";
import { IBike } from "../shared/types/bike";
import { IReservation } from "../shared/types/reservation";

export function MyReservations() {
  const [loading, setLoading] = useState<boolean>(false);
  const [bikes, setBikes] = useState<IBike[]>([]);
  const [user] = useAuthState(auth);

  const modals = useModals();

  useEffect(() => {
    const getReservations = async () => {
      const q = query(
        collection(db, Collection.Reservations),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);

      const reservations = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IReservation)
      );

      console.log(reservations);

      Promise.all(
        reservations.map(async (reservation) => {
          const docQuery = doc(db, Collection.Bikes, reservation.bikeId);

          const querySnapshot = await getDoc(docQuery);
        })
      );

      //   setReservations(
      //     reservations.map((item) => [
      //       item.period.start?.toDate() ?? null,
      //       item.period.end?.toDate() ?? null,
      //     ])
      //   );
    };

    if (user) {
      getReservations();
    }
  }, [user]);

  const openCancellationModal = () => {
    modals.openConfirmModal({
      title: "Cancel reservation",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to cancel your reservation?</Text>
      ),
      labels: { confirm: "Yes", cancel: "No" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });
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
        ) : (
          bikes.map((bike) => (
            <Grid.Col span={4} key={bike.id}>
              <BikeCard
                bike={bike}
                // onRent={openCancellationModal.bind(null, bike)}
              />
            </Grid.Col>
          ))
        )}
      </Grid>
    </Container>
  );
}
