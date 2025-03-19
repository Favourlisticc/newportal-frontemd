import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Adminsidebar from "./component/sidebar";
import Navbar from "./component/navbar";

const ProtectedRoute = () => {
  const jwt = localStorage.getItem("SuperAdmintoken");
  console.log(jwt)

  if (!jwt) {
    return <Navigate to="/superadmin/login" />;
  }

  return (
    <div className="flex">
    <Adminsidebar />
    <div className="flex flex-col flex-1 pl-60">
        <Navbar />
        <main className="p-6 overflow-y-auto mt-9">
          <Outlet />
        </main>
      </div>
  </div>
  )
};

export default ProtectedRoute;