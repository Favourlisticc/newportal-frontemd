import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import ConsultSidebar from "./dashboard/component/sidebar";
import Navbar from "./dashboard/component/navbar";

const ProtectedRoute = () => {
  const jwt = localStorage.getItem("consultJwt");
  console.log(jwt)

  if (!jwt) {
    return <Navigate to="/signup" />;
  }

  return (
    <div className="flex">
    <ConsultSidebar />
    <div className="flex flex-col flex-1 pl-60">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
  </div>
  )
};

export default ProtectedRoute;