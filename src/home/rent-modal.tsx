import { Alert, Box, Button, Indicator } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { DateRangePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { Period } from "../shared/types/reservation";
import { AlertCircle } from "tabler-icons-react";
import { SupabaseClient } from "@supabase/supabase-js";
import { IUser } from "../shared/types/user";
import { Tables } from "../shared/types/tables";

interface RentModalProps {
  supabase: SupabaseClient;
  user: IUser | null;
  bikeId: string;
  onClose?: () => void;
}

export const RentModal = ({
  supabase,
  bikeId,
  user,
  onClose,
}: RentModalProps) => {
  const [value, setValue] = useState<Period<Date>>([null, null]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reservations, setReservations] = useState<Period<Date>[]>([]);

  useEffect(() => {
    const getReservations = async () => {
      const { data: reservations } = await supabase
        .from("reservations")
        .select("*")
        .eq("bike_id", bikeId);

      const period = reservations?.map(
        (item) => ([item.start_date, item.end_date] as Period<Date>) ?? []
      );

      setReservations(period ?? []);
    };

    getReservations();
  }, []);

  const rentBike = async () => {
    await supabase.from(Tables.Reservations).insert({
      bike_id: bikeId,
      userId: user?.id,
      start_date: value[0],
      end_date: value[1],
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
    if (!value[0] || !value[1])
      return showNotification({
        message: "Please, select date range",
        color: "red",
      });

    setLoading(true);

    try {
      await rentBike();
      showNotification({ message: "Bike sucessfully rented!" });
      onClose?.();
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
