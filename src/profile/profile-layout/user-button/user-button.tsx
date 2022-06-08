import React from "react";
import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
} from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import { useStyles } from "./styles";

interface UserButtonProps extends UnstyledButtonProps<"button"> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

export function UserButton({
  image,
  name,
  email,
  icon,
  ...others
}: UserButtonProps) {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {/* {icon || <ChevronRight size={14} />} */}
      </Group>
    </UnstyledButton>
  );
}
