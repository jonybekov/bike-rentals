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

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="my-reservations" element={<MyReservations />} />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="reset" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="users" element={<Users />} />
            <Route path="users/add" element={<CreateUser />} />
            <Route path="users/:userId/edit" element={<EditUser />} />

            <Route path="bikes" element={<Bikes />} />
            <Route path="bikes/add" element={<CreateBike />} />
            <Route path="bikes/:bikeId/edit" element={<EditBike />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
