import { Card, Text, Group, Button } from "@mantine/core";
import { GasStation, Gauge, ManualGearbox, Users } from "tabler-icons-react";
import { useStyles } from "./styles";
import { IBike } from "../../types/bike";
import dayjs from "dayjs";

const mockdata = [
  { label: "4 passengers", icon: Users },
  { label: "100 km/h in 4 seconds", icon: Gauge },
  { label: "Automatic gearbox", icon: ManualGearbox },
  { label: "Electric", icon: GasStation },
];

interface BikeCardProps {
  period?: [Date, Date];
  bike: IBike;
  action?: "rent" | "cancel";
  onClickAction?: () => Promise<void>;
  onRateBike?: () => void;
}

export function BikeCard({
  period,
  bike,
  onClickAction,
  onRateBike,
  action = "rent",
}: BikeCardProps) {
  const { classes } = useStyles();
  const unavailable = bike.available === false;

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group position="apart">
        <div>
          <Text weight={500}>{bike.model?.name}</Text>
          <Text size="xs" color="dimmed">
            {bike.color.name} • {bike.location.name}
          </Text>
          {period && (
            <Text size="xs" color="dimmed">
              Reserved date: {dayjs(period?.[0]).format("DD.MM.YYYY")} -{" "}
              {dayjs(period?.[1]).format("DD.MM.YYYY")}
            </Text>
          )}

          <Text size="xs" color="dimmed">
            Average rate: {bike.avg_rate ? `${bike.avg_rate} out of 5` : "N/A"}
          </Text>
        </div>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Group spacing={16}>
          {action === "cancel" ? (
            <Button
              radius="xl"
              color="red"
              style={{ flex: 1 }}
              onClick={onClickAction}
            >
              Cancel
            </Button>
          ) : (
            <>
              <Button
                disabled={unavailable}
                radius="xl"
                style={{ flex: 1 }}
                onClick={unavailable ? undefined : () => onClickAction?.()}
              >
                {unavailable ? "Unavailable" : "Rent now"}
              </Button>
              <Button
                radius="xl"
                color="gray"
                style={{ flex: 1 }}
                onClick={onRateBike}
              >
                Rate this bike
              </Button>
            </>
          )}
        </Group>
      </Card.Section>
    </Card>
  );
}
