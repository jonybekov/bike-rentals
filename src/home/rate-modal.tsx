import { Button, Slider } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { Tables } from "../shared/types/tables";
import { IUser } from "../shared/types/user";

interface RateModalProps {
  user: IUser | null;
  supabase: SupabaseClient;
  bikeId: string;
  onClose?: () => void;
}

export const RateModal = ({
  supabase,
  bikeId,
  user,
  onClose,
}: RateModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<number>(3);

  const rateBike = async () => {
    const { data: bikeRates } = await supabase
      .from(Tables.BikeRates)
      .select("rate")
      .eq("bike_id", bikeId);

    const totalRates =
      bikeRates?.reduce<number>((acc, item) => (acc += item.rate), 0) ?? 0;

    const avgRate = Math.floor(
      (totalRates + value) / ((bikeRates?.length ?? 0) + 1)
    );

    await Promise.all([
      supabase.from(Tables.BikeRates).insert({
        bike_id: bikeId,
        user_id: user?.id,
        rate: value,
      }),

      supabase
        .from(Tables.Bikes)
        .update({
          avg_rate: avgRate,
        })
        .match({ id: bikeId }),
    ]);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await rateBike();
      showNotification({ message: "Thank you for your review!" });
      onClose?.();
    } catch (err: any) {
      showNotification({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Slider
        color="yellow"
        value={value}
        mt={36}
        mb={48}
        onChange={setValue}
        step={1}
        max={5}
        min={1}
        marks={[
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
          { value: 5, label: "5" },
        ]}
      />
      <Button
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        Submit review
      </Button>
    </div>
  );
};
