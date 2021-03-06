import { useState } from "react";
import {
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Text,
  Avatar,
  UnstyledButton,
  Menu,
  Button,
  Title,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { useStyles } from "./styles";
import { HEADER_HEIGHT } from "./consts";
import { ChevronDown, Logout } from "tabler-icons-react";
import { Link, NavLink } from "react-router-dom";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";
import { useSignOut } from "react-supabase";
import { useAuth } from "../../../app/contexts/auth-context";
import { UserRole } from "../../types/user";

interface NavbarProps {
  links?: { link: string; label: string }[];
}

const AvatarLoader = (props: IContentLoaderProps) => {
  return (
    <ContentLoader
      speed={2}
      width={120}
      height={32}
      viewBox="0 0 200 32"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="48" y="12" rx="8" ry="8" width="88" height="10" />
      <circle cx="16" cy="16" r="16" />
    </ContentLoader>
  );
};

export function Navbar({ links }: NavbarProps) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [userMenuOpened, setUserMenuOpened] = useBooleanToggle(false);
  const { loading, user } = useAuth();
  const [_, logOut] = useSignOut();

  const [active, setActive] = useState(links?.[0].link);
  const { classes, cx } = useStyles();

  const items = links?.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        toggleOpened(false);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={HEADER_HEIGHT} mb="lg" className={classes.root}>
      <Container className={classes.header}>
        <Title order={3} color="black">
          <Link to="/">Bike Rental</Link>
        </Title>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        {loading ? (
          <AvatarLoader />
        ) : !user ? (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        ) : (
          <Menu
            size={260}
            placement="end"
            transition="pop-top-right"
            className={classes.userMenu}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            control={
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${user?.display_name}`}
                    radius="xl"
                    size={20}
                  />
                  <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                    {user?.display_name}
                  </Text>
                  <ChevronDown size={12} />
                </Group>
              </UnstyledButton>
            }
          >
            {(user.role.name === UserRole.Admin ||
              user.role.name === UserRole.Manager) && (
              <Link to="/profile/bikes">
                <Menu.Item>Dashboard</Menu.Item>
              </Link>
            )}
            <Link to="/my-reservations">
              <Menu.Item>My Reservations</Menu.Item>
            </Link>
            <Menu.Item icon={<Logout size={14} />} onClick={logOut}>
              Logout
            </Menu.Item>
          </Menu>
        )}

        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
