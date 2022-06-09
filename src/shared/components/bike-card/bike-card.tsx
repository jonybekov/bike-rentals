import React from "react";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  createStyles,
  Center,
  Button,
} from "@mantine/core";
import { GasStation, Gauge, ManualGearbox, Users } from "tabler-icons-react";
import { useStyles } from "./styles";
import { IBike } from "../../types/bike";

const mockdata = [
  { label: "4 passengers", icon: Users },
  { label: "100 km/h in 4 seconds", icon: Gauge },
  { label: "Automatic gearbox", icon: ManualGearbox },
  { label: "Electric", icon: GasStation },
];

interface BikeCardProps {
  bike: IBike;
  onRent?: () => Promise<void>;
}

export function BikeCard({ bike, onRent }: BikeCardProps) {
  const { classes } = useStyles();
  const unavailable = bike.available === false;

  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size={18} className={classes.icon} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      {/* <Card.Section className={classes.imageSection}>
        <Image src={bike.image} alt="Tesla Model S" />
      </Card.Section> */}

      <Group position="apart">
        <div>
          <Text weight={500}>{bike.model?.name}</Text>
          <Text size="xs" color="dimmed">
            {bike.color.name} • {bike.location.name}
          </Text>
        </div>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Group spacing={30}>
          <div>
            <Text size="xl" weight={700} sx={{ lineHeight: 1 }}>
              $168.00
            </Text>
            <Text
              size="sm"
              color="dimmed"
              weight={500}
              sx={{ lineHeight: 1 }}
              mt={3}
            >
              per day
            </Text>
          </div>

          <Button
            disabled={unavailable}
            radius="xl"
            style={{ flex: 1 }}
            onClick={unavailable ? undefined : () => onRent?.()}
          >
            {unavailable ? "Unavailable" : "Rent now"}
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
