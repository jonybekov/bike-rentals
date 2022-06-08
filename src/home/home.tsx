import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Indicator,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useModals } from "@mantine/modals";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Collection } from "../app/services/collections";
import { auth, db } from "../app/services/firebase";
import { IBike } from "../shared/types/bike";
import { BikeCard } from "./bike-card";
import { Navbar } from "./navbar";
import { DateRangePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useAuthState } from "react-firebase-hooks/auth";
import { IReservation, Period } from "../shared/types/reservation";
import { AlertCircle } from "tabler-icons-react";

interface RentModalProps {
  bikeId: string;
  onClose?: () => void;
}

const RentModal = (props: RentModalProps) => {
  const [value, setValue] = useState<Period<Date>>([null, null]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useAuthState(auth);
  const [reservations, setReservations] = useState<Period<Date>[]>([]);

  useEffect(() => {
    const getReservations = async () => {
      const q = query(
        collection(db, Collection.Reservations),
        where("bikeId", "==", props.bikeId)
      );
      const querySnapshot = await getDocs(q);

      const reservations = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IReservation)
      );

      setReservations(
        reservations.map((item) => [
          item.period[0]?.toDate() ?? null,
          item.period[1]?.toDate() ?? null,
        ])
      );
    };

    getReservations();
  }, []);

  const rentBike = async () => {
    await addDoc(collection(db, Collection.Reservations), {
      bikeId: props.bikeId,
      userId: user?.uid,
      period: value,
    });
  };

  const isReserved = (date: Date) => {
    return (
      reservations.length > 0 &&
      reservations.some((reservation) => {
        const from = reservation[0] ? dayjs(reservation[0]) : null;
        const to = reservation[1] ? dayjs(reservation[1]) : null;

        return dayjs(date).isBetween(from, to, "day", "[]");
      })
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await rentBike();
      showNotification({ message: "Bike sucessfully rented!" });
      props.onClose?.();
    } catch (err: any) {
      showNotification({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const excludeDate = (date: Date) => {
    if (!value) {
      return false;
    }

    const current = dayjs(date);
    const [from, to] = [dayjs(value?.[0]), dayjs(value?.[1])];
    const tooLate = value[0] && current.diff(from, "days") > 7;
    const tooEarly = value[1] && to.diff(current, "days") > 7;

    return isReserved(date) || !!tooEarly || !!tooLate;
  };

  const renderDay = (date: Date) => {
    const day = date.getDate();
    const isDisabled = !isReserved(date);

    return (
      <Indicator size={6} color="red" offset={8} disabled={isDisabled}>
        <div>{day}</div>
      </Indicator>
    );
  };

  return (
    <>
      <Box mb="md">
        <Alert
          mb="lg"
          icon={<AlertCircle size={32} />}
          title="Note"
          withCloseButton
        >
          Days with red indicator have already been reserved
        </Alert>
        <DateRangePicker
          minDate={dayjs().toDate()}
          placeholder="Pick dates range"
          value={value}
          excludeDate={excludeDate}
          onChange={setValue}
          renderDay={renderDay}
        />
      </Box>
      <Button
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        Rent
      </Button>
    </>
  );
};

export function Home() {
  const [bikes, setBikes] = useState<IBike[]>([]);
  const modals = useModals();

  const links = [
    {
      link: "/about",
      label: "Features",
    },
    {
      link: "/pricing",
      label: "Pricing",
    },
    {
      link: "/learn",
      label: "Learn",
    },
    {
      link: "/community",
      label: "Community",
    },
  ];

  useEffect(() => {
    const getBikes = async () => {
      const querySnapshot = await getDocs(collection(db, "bikes"));

      const bikes = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IBike)
      );

      setBikes(bikes);
    };

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

  return (
    <div>
      <Navbar links={links} />
      <Container>
        <Title sx={{ marginBottom: 24 }}>Featured bikes</Title>
        <Grid>
          {bikes.map((bike) => (
            <Grid.Col span={4} key={bike.id}>
              <BikeCard
                bike={bike}
                onRent={openContentModal.bind(null, bike)}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
