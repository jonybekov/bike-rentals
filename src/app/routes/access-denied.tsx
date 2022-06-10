import { Button, Container, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export const AccessDenied = () => {
  return (
    <Container py="lg">
      <Title mb="lg">Access Denied!</Title>
      <Link to="/">
        <Button>Go back home</Button>
      </Link>
    </Container>
  );
};
