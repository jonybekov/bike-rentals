import { useState } from "react";
import { Navbar, Group, ScrollArea } from "@mantine/core";
import { BellRinging, Logout, Users } from "tabler-icons-react";
import { useStyles } from "./styles";
import { UserButton } from "../user-button";
import { NavLink } from "react-router-dom";
import { useSignOut } from "react-supabase";
import { useAuth } from "../../../app/contexts/auth-context";

const data = [
  { link: "bikes", label: "Bikes", icon: BellRinging },
  { link: "users", label: "Users", icon: Users },
];

export function ProfileNavbar() {
  const { classes, cx } = useStyles();
  const [active] = useState("Billing");
  const [_, signOut] = useSignOut();
  const { user } = useAuth();

  const links = data.map((item) => (
    <NavLink
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      to={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <Navbar height={700} width={{ sm: 300 }} p="md">
      <Navbar.Section>
        <Group className={classes.header} position="apart">
          Dashboard
        </Group>
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea}>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton
          image={""}
          name={user?.display_name ?? ""}
          email={user?.email ?? ""}
        />
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            signOut();
          }}
        >
          <Logout className={classes.linkIcon} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}
