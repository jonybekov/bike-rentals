import { Center, Container, Grid, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";

import { useEffect, useState } from "react";
import { IBike, IBikeFilter } from "../shared/types/bike";
import { BikeCard } from "../shared/components/bike-card";
import { Navbar } from "../shared/components/navbar";
import { BikeFilters } from "./bike-filters";
import ThreeDots from "../shared/components/three-dots";
import { RentModal } from "./rent-modal";
import { useClient } from "react-supabase";
import { useAuth } from "../app/contexts/auth-context";
import { RateModal } from "./rate-modal";

export function Home() {
  const supabase = useClient();
  const modals = useModals();
  const { user } = useAuth();
  const [fetching, setLoading] = useState<boolean>(false);

  const [bikes, setBikes] = useState<any[]>([]);

  const getReservations = async (bikeFilter?: IBikeFilter) => {
    setLoading(true);
    const { model, color, location, avgRate = 0 } = bikeFilter || {};

    const reservationsRequest = () =>
      bikeFilter?.period?.[0] && bikeFilter?.period?.[1]
        ? supabase
            .from("reservations")
            .select("*")
            .lte("start_date", bikeFilter?.period[1].toUTCString())
            .gte("end_date", bikeFilter?.period[0].toUTCString())
        : Promise.resolve({ data: null });

    const bikesRequest = () =>
      supabase
        .from("bikes")
        .select(
          "id, model ( name ), color ( name ), location ( name ), available, avg_rate"
        )
        .match({
          ...(model?.id && { model: model.id }),
          ...(color?.id && { color: color.id }),
          ...(location?.id && { location: location.id }),
          ...(avgRate && { avg_rate: avgRate }),
        });

    const [{ data: reservations }, { data: bikes }] = await Promise.all([
      reservationsRequest(),
      bikesRequest(),
    ]);

    const reservedBikeIds = reservations?.map((item) => item.bike_id);
    const availableBikes = bikes?.filter(
      (bike) => !reservedBikeIds?.includes(bike.id) || !!bike.available
    );

    setBikes(availableBikes ?? []);
    setLoading(false);
  };

  useEffect(() => {
    getReservations();
  }, []);

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

  const openRateModal = async (bike: IBike) => {
    const id = modals.openModal({
      title: `Rate ${bike.model.name}`,
      centered: true,
      children: (
        <RateModal
          user={user}
          supabase={supabase}
          bikeId={bike.id}
          onClose={() => modals.closeModal(id)}
        />
      ),
    });
  };

  const handleSearch = (values: IBikeFilter) => {
    getReservations(values);
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
              <ThreeDots width={200} />
            </Center>
          ) : (
            bikes?.map((bike) => (
              <Grid.Col span={4} key={bike.id}>
                <BikeCard
                  bike={bike}
                  onClickAction={openContentModal.bind(null, bike)}
                  onRateBike={openRateModal.bind(null, bike)}
                />
              </Grid.Col>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
}
