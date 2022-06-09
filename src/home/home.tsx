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
import { useSelect, useFilter, useClient } from "react-supabase";
import { useAuth } from "../app/contexts/auth-context";

export function Home() {
  const supabase = useClient();
  const modals = useModals();
  const { user } = useAuth();

  const [filters, setFilters] = useState<IBikeFilter>();
  const filter = useFilter(
    (query) => {
      const { model, color, location } = filters || {};

      return query.match({
        ...(model?.id && { model: model.id }),
        ...(color?.id && { color: color.id }),
        ...(location?.id && { location: location.id }),
      });
    },
    [filters?.model?.id, filters?.color?.id, filters?.location?.id]
  );

  const [{ data, fetching }, reexecute] = useSelect("bikes", {
    columns: "id, model ( name ), color ( name ), location ( name ), available",
    filter,
  });

  // const getReservations = async (period?: Period<Date>) => {
  //   if (!period) return Promise.resolve(null);
  //   const from = period[0] && Timestamp.fromDate(period[0]);
  //   const to = period[1] && Timestamp.fromDate(period[1]);

  //   const q1 = query(
  //     collection(db, "reservations"),
  //     where("period.start", ">=", to)
  //   );

  //   const q2 = query(
  //     collection(db, "reservations"),
  //     where("period.end", "<=", from)
  //   );

  //   return getDocs(q1);
  // };

  // const getBikes = async (filters?: IBikeFilter) => {
  //   setLoading(true);

  //   const reservationsMap = console.log(
  //     reservations?.docs.map((item) => item.data()),
  //     filters?.period
  //   );

  //   const whereOperators: Array<QueryConstraint | undefined> = [
  //     filters?.model?.id
  //       ? where("model.id", "==", filters?.model?.id)
  //       : undefined,
  //     filters?.color?.id
  //       ? where("color.id", "==", filters?.color?.id)
  //       : undefined,
  //     filters?.location?.id
  //       ? where("location.id", "==", filters?.location?.id)
  //       : undefined,
  //   ];

  //   const q = query(
  //     collection(db, "bikes"),
  //     ...(whereOperators.filter((where) => !!where) as QueryConstraint[])
  //   );

  //   const querySnapshot = await getDocs(q);

  //   const bikes = querySnapshot.docs.map(
  //     (doc) =>
  //       ({
  //         id: doc.id,
  //         ...doc.data(),
  //       } as IBike)
  //   );

  //   setBikes(bikes);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   getBikes();
  // }, []);

  const openContentModal = async (bike: IBike) => {
    const id = modals.openModal({
      title: `Rent ${bike.model.name}`,
      centered: true,
      children: (
        <RentModal
          user={user}
          supabase={supabase}
          bikeId={bike.id}
          onClose={() => modals.closeModal(id)}
        />
      ),
    });
  };

  const handleSearch = (values: IBikeFilter) => {
    setFilters(values);
  };

  return (
    <div>
      <Navbar />
      <Container>
        <BikeFilters loading={fetching} onSearch={handleSearch} />
        <Title mt="lg" sx={{ marginBottom: 24 }}>
          Featured bikes
        </Title>

        <Grid>
          {fetching ? (
            <Center style={{ width: "100%" }}>
              <ThreeDots />
            </Center>
          ) : (
            data?.map((bike) => (
              <Grid.Col span={4} key={bike.id}>
                <BikeCard
                  bike={bike}
                  onClickAction={openContentModal.bind(null, bike)}
                />
              </Grid.Col>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
}
