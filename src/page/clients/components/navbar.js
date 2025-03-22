import { FiLogOut, FiMenu } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Navbar = ({ onToggleSidebar }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [birthdayMessage, setBirthdayMessage] = useState(null);


  useEffect(() => {
    const storedUser = localStorage.getItem("Clientuser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {

    
    
    if (user) {
      // Fetch birthday message if today is the user's birthday
      const today = new Date();
      const userDob = new Date(user.dateOfBirth);

     

      if (
        today.getMonth() === userDob.getMonth() &&
        today.getDate() === userDob.getDate()
      ) {
        axios
          .get(`https://newportal-backend.onrender.com/client/birthday-message?userId=${user._id}`)
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
  }, [user]);


  console.log("userdata", user)

 

  const handleLogout = () => {
    localStorage.removeItem("Clienttoken");
    localStorage.removeItem("Clientuser");
    window.location.href = "/client/login"; // Update with your login route
  };

  return (
    <header className="bg-[#002657] shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Toggle Button for Mobile */}
        <button
          onClick={onToggleSidebar}
          className="text-white hover:text-[#E5B305] transition lg:hidden"
        >
          <FiMenu className="w-6 h-6" />
        </button>


           {/* Birthday Message */}
           {birthdayMessage && (
          <div className="flex items-center space-x-2 bg-[#E5B305] text-[#002657] px-4 py-2 rounded-lg">
            <span className="font-medium">{birthdayMessage}</span>
            <span className="text-2xl">🎉</span>
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-3">
            <img
              src={user.passportPhoto || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-[#E5B305]"
            />
            <div>
              <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-[#E5B305] text-sm">@{user.username}</p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-white hover:text-[#E5B305] transition"
        >
          <FiLogOut className="w-6 h-6" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;