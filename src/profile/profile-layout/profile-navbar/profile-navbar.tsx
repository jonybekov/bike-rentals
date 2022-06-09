import React, { useState } from "react";
import { Navbar, Group, Code, ScrollArea } from "@mantine/core";
import {
  BellRinging,
  Fingerprint,
  Key,
  Settings,
  TwoFA,
  DatabaseImport,
  Receipt2,
  SwitchHorizontal,
  Logout,
  Users,
} from "tabler-icons-react";
import { useStyles } from "./styles";
import { auth, logout } from "../../../app/services/firebase";
import { UserButton } from "../user-button";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink } from "react-router-dom";
import { useSignOut } from "react-supabase";
import { useAuth } from "../../../app/contexts/auth-context";

const data = [
  { link: "bikes", label: "Bikes", icon: BellRinging },
  { link: "users", label: "Users", icon: Users },
];

export function ProfileNavbar() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Billing");
  const [{ error, fetching }, signOut] = useSignOut();
  const { session, user } = useAuth();

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
          Logo
          <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
        </Group>
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea}>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton
          image={""}
          name={`User #${user?.id}`}
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
