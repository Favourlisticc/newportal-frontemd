import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import ClientSidebar from "../components/sidebar";
import Navbar from "../components/navbar";

const ProtectedRoute = () => {
  const jwt = localStorage.getItem("Clienttoken");
  console.log(jwt)

  if (!jwt) {
    return <Navigate to="/signup" />;
  }

  return (
    <div className="flex">
    <ClientSidebar />
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