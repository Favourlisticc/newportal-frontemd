import React, { useState, useEffect } from "react";
import { ArrowRightOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import axios from "axios";

const Navbar = ({ toggleSidebar }) => {
  const [userData, setUserData] = useState(null);
  const [birthdayMessage, setBirthdayMessage] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("realtorData");
    if (storedData) {
      const user = JSON.parse(storedData);
      setUserData(user);

      // Fetch birthday message if today is the user's birthday
      const today = new Date();
      const userDob = new Date(user.dob);

      if (
        today.getMonth() === userDob.getMonth() &&
        today.getDate() === userDob.getDate()
      ) {
        axios
          .get(`https://newportal-backend.onrender.com/realtor/birthday-message?userId=${user._id}`)
          .then((response) => {
            if (response.data.message) {
              setBirthdayMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.error("Error fetching birthday message:", error);
          });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("realtorData");
    localStorage.removeItem("realtorJwt");
    window.location.href = "/realtor/login"; // Update with your login route
  };

  if (!userData) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between mx-auto">
        {/* Toggle Sidebar Button (Visible on Mobile) */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-[#002657] hover:text-[#E5B305] transition-colors"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* User Info Section */}
        <div className="flex items-center space-x-4">
          {userData.profileimage ? (
            <img
              src={userData.profileimage}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-[#002657]"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{
                background: `linear-gradient(135deg, #002657 50%, #E5B305 50%)`,
                border: "2px solid #002657",
              }}
            >
              {`${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()}
            </div>
          )}

          <div className="hidden md:block">
            <p className="text-gray-800 font-semibold">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-gray-500 text-sm">@{userData.username}</p>
          </div>
        </div>

        {/* Birthday Message */}
        {birthdayMessage && (
          <div className="flex items-center space-x-2 bg-[#E5B305] text-[#002657] px-4 py-2 rounded-lg">
            <span className="font-medium">{birthdayMessage}</span>
            <span className="text-2xl">🎉</span>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-[#002657] hover:text-[#E5B305] transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span className="hidden md:inline font-medium">Logout</span>
        </button>
      </div>

      {/* Mobile View User Info */}
      <div className="md:hidden mt-2">
        <p className="text-gray-800 font-semibold text-center">
          {userData.firstName} {userData.lastName}
        </p>
        <p className="text-gray-500 text-sm text-center">@{userData.username}</p>
      </div>
    </nav>
  );
};

export default Navbar;