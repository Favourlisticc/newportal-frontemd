import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import RealtorSidebar from "./page/realtor/dashboard/component/sidebar";
import Navbar from "./page/realtor/dashboard/component/navbar";

const RealtorsLayout = () => {
  return (
    <div className="flex">
    <RealtorSidebar />
    <div className="flex flex-col flex-1 pl-60">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
  </div>
  );
};

export default RealtorsLayout;
