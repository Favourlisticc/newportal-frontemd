import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import ConsultSidebar from "./page/consult/dashboard/component/sidebar";

const ConsultLayout = () => {
  return (
    <div className="flex">
      <ConsultSidebar />
      <main className="flex-grow p-4">
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
};

export default ConsultLayout;
