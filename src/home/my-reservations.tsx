import { Container } from "@mantine/core";
import { useAuth } from "../app/contexts/auth-context";
import { Navbar } from "../shared/components/navbar";
import { UserReservations } from "../shared/components/user-reservations";

export function MyReservations() {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <Container>
        <UserReservations user={user} title="My Reservations" />;
      </Container>
    </div>
  );
}
