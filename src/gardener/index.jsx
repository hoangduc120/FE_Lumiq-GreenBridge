// routes/gardener.routes.jsx
import { Route } from "react-router-dom";
import GardenerLayout from "../gardener/GardenerLayout";
import ManagePlant from "../gardener/ManagePlant";
import AddPlant from "../gardener/AddPlant";
import EditPlant from "../gardener/EditPlant";
export const gardenerRoutes = (
  <Route path="/gardener" element={<GardenerLayout />}>
    <Route index element={<ManagePlant />} />
    <Route path="manage-plant" element={<ManagePlant />} />
    <Route path="add-plant" element={<AddPlant />} />
    <Route path="edit-plant/:id" element={<EditPlant />} />
    {/* Add more gardener-specific routes here */}
  </Route>
);
