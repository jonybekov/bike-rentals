import { AppShell, Paper, useMantineTheme } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";
import { ProfileNavbar } from "./profile-navbar";

export function ProfileLayout({}: React.PropsWithChildren<any>) {
  const theme = useMantineTheme();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<ProfileNavbar />}
    >
      <Paper withBorder p="lg" shadow="md">
        <Outlet />
      </Paper>
    </AppShell>
  );
}
