// Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiActivity, FiCalendar, FiUpload } from 'react-icons/fi';
import { MdWorkHistory } from "react-icons/md";
import { RiAccountBoxLine } from "react-icons/ri";
import { FcDebt } from "react-icons/fc";

import logo from "../../../public/BR (2).jpg"

const Sidebar = () => {
  const navItems = [
    { to: "/client-dashboard", icon: FiHome, text: "Dashboard" },
    { to: "/client-dashboard/products", icon: FiFileText, text: "Products" },
    { to: "/client-dashboard/unsettled-sales", icon: FcDebt, text: "Unsettled Sales" },
    { to: "/client-dashboard/purchasehistory", icon: MdWorkHistory, text: "Purchase Record" },
   
    // { to: "/client-dashboard/payment", icon: FiCalendar, text: "Next Payment Details" },
    { to: "/client-dashboard/upload", icon: FiUpload, text: "Data Upload/Contract Signing" },
    { to: "/client-dashboard/profile", icon: RiAccountBoxLine, text: "Profile" },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white fixed h-full">
      <div className='flex justify-center items-center mt-8'>
       <img src={logo} className='w-32 h-32' /> 
       </div>
      <div className="p-6 text-2xl font-bold">Client Dashboard</div>

      <nav className="mt-6">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center p-4 hover:bg-indigo-800 transition-colors ${
                isActive ? 'bg-indigo-800 border-r-4 border-white' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.text}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;