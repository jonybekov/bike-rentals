import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "../../auth";
import { Login } from "../../auth/login";
import { Home } from "../../home";
import { ProfileLayout } from "../../profile/profile-layout";
import ProtectedRoute from "./protected-route";
import { Bikes } from "../../profile/bikes";
import { CreateBike } from "../../profile/bikes/create-bike";
import { EditBike } from "../../profile/bikes/edit-bike";
import { Users } from "../../profile/users";
import { CreateUser } from "../../profile/users/create-user";
import { EditUser } from "../../profile/users/edit-user";
import { MyReservations } from "../../home/my-reservations";
import AuthRoute from "./auth-route";
import { UserRole } from "../../shared/types/user";
import { AccessDenied } from "./access-denied";
import { Reservations } from "../../profile/users/reservations";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="my-reservations" element={<MyReservations />} />
        <Route element={<AuthRoute />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="reset" element={<Register />} />
        <Route
          element={
            <ProtectedRoute allowTo={[UserRole.Manager, UserRole.Admin]} />
          }
        >
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="users" element={<Users />} />
            <Route path="users/add" element={<CreateUser />} />
            <Route path="users/:userId/edit" element={<EditUser />} />
            <Route
              path="users/:userId/reservations"
              element={<Reservations />}
            />
            <Route path="bikes" element={<Bikes />} />
            <Route path="bikes/add" element={<CreateBike />} />
            <Route path="bikes/:bikeId/edit" element={<EditBike />} />
          </Route>
        </Route>
        <Route path="access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
}
