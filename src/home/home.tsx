import { Center, Container, Grid, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import {
  collection,
  getDocs,
  query,
  QueryConstraint,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../app/services/firebase";
import { IBike, IBikeFilter } from "../shared/types/bike";
import { BikeCard } from "../shared/components/bike-card";
import { Navbar } from "../shared/components/navbar";
import { BikeFilters } from "./bike-filters";
import ThreeDots from "../shared/components/three-dots";
import { RentModal } from "./rent-modal";
import { Period } from "../shared/types/reservation";

export function Home() {
  const [bikes, setBikes] = useState<IBike[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const modals = useModals();

  const getReservations = async (period?: Period<Date>) => {
    if (!period) return Promise.resolve(null);
    const from = period[0] && Timestamp.fromDate(period[0]);
    const to = period[1] && Timestamp.fromDate(period[1]);

    const q1 = query(
      collection(db, "reservations"),
      where("period.start", ">=", to)
    );

    const q2 = query(
      collection(db, "reservations"),
      where("period.end", "<=", from)
    );

    return getDocs(q1);
  };

  const getBikes = async (filters?: IBikeFilter) => {
    setLoading(true);

    const reservations = await getReservations(filters?.period);

    const reservationsMap = console.log(
      reservations?.docs.map((item) => item.data()),
      filters?.period
    );

    const whereOperators: Array<QueryConstraint | undefined> = [
      filters?.model?.id
        ? where("model.id", "==", filters?.model?.id)
        : undefined,
      filters?.color?.id
        ? where("color.id", "==", filters?.color?.id)
        : undefined,
      filters?.location?.id
        ? where("location.id", "==", filters?.location?.id)
        : undefined,
    ];

    const q = query(
      collection(db, "bikes"),
      ...(whereOperators.filter((where) => !!where) as QueryConstraint[])
    );

    const querySnapshot = await getDocs(q);

    const bikes = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as IBike)
    );

    setBikes(bikes);
    setLoading(false);
  };

  useEffect(() => {
    getBikes();
  }, []);

  const openContentModal = async (bike: IBike) => {
    const id = modals.openModal({
      title: `Rent ${bike.model.name}`,
      centered: true,
      children: (
        <RentModal bikeId={bike.id} onClose={() => modals.closeModal(id)} />
      ),
    });
  };

  const handleSearch = (values: IBikeFilter) => {
    getBikes(values);
  };

  return (
    <div>
      <Navbar />
      <Container>
        <BikeFilters loading={loading} onSearch={handleSearch} />
        <Title mt="lg" sx={{ marginBottom: 24 }}>
          Featured bikes
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
                  onRent={openContentModal.bind(null, bike)}
                />
              </Grid.Col>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
}
