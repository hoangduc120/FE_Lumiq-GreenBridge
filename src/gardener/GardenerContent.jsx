import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManagePlant from './ManagePlant';
import AddPlant from './AddPlant';
import EditPlant from './EditPlant';
const GardenerContent = () => {
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full overflow-y-auto border-l border-gray-300 dark:border-darkOverlay-300">
      <Routes>
        <Route path="/manage-plant" element={<ManagePlant />} />
        <Route path="/add-plant" element={<AddPlant />} />
        <Route path="/edit-plant/:id" element={<EditPlant />} />
      </Routes>
    </div>
  );
};

export default GardenerContent;
