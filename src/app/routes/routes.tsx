import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "../../auth";
import { Login } from "../../auth/login";
import { Home } from "../../home";
import { ProfileLayout } from "../../profile/profile-layout";
import { CreateBike } from "../../profile/create-bike";
import ProtectedRoute from "./protected-route";
import { Bikes } from "../../profile/bikes";
import { EditBike } from "../../profile/edit-bike";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="reset" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="bikes/add" element={<CreateBike />} />
            <Route path="users" element={"Users"} />
            <Route path="bikes" element={<Bikes />} />
            <Route path="bikes/:bikeId/edit" element={<EditBike />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
