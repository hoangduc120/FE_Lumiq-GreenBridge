import React from 'react';
import GardenerSidebar from './GardenerSidebar';
import GardenerContent from './GardenerContent';

const GardenerLayout = () => {
  return (
    <div className="w-screen h-screen flex items-center bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <GardenerSidebar />
      <GardenerContent />
    </div>
  );
};

export default GardenerLayout;
