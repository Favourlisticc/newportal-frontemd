import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("Clientuser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Clienttoken");
    localStorage.removeItem("Clientuser");
    window.location.href = "/client/login"; // Update with your login route
  };

  return (
    <header className="bg-[#002657] shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
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
