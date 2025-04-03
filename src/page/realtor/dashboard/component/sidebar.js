import React, { useState } from 'react';
import {
  FaHome, FaUser, FaFileAlt, FaUsers, FaMoneyCheckAlt, FaBuilding, FaQuestionCircle, FaWallet, FaChevronDown, FaChevronRight,
  FaLaptop, FaCameraRetro, FaLock, FaRegFileAlt, FaCreditCard, FaRegBuilding, FaTimes
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { BsFillHousesFill } from "react-icons/bs";
import logo from "../../../../public/BR (2).jpg";

import { FiActivity } from "react-icons/fi";

const RealtorSidebar = ({ isSidebarOpen, closeSidebar }) => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuName) => {
    setOpenMenus((prevState) => {
      const newState = { ...prevState };
      for (const key in newState) {
        if (key !== menuName && newState[key]) {
          newState[key] = false;
        }
      }
      newState[menuName] = !prevState[menuName];
      return newState;
    });
  };

  const activeStyle = "bg-[#E5B305] text-[#002657] font-semibold border-l-4 border-[#002657]";
  const hoverStyle = "hover:bg-[#003973] hover:text-white transition-colors duration-200";

  return (
    <div
      className={`fixed z-[999] top-0 left-0 w-64 h-screen bg-[#002657] text-white flex flex-col overflow-y-auto shadow-xl pb-10 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Close Button (Visible on Mobile) */}
      <button
        onClick={closeSidebar}
        className="md:hidden absolute top-4 right-4 text-white hover:text-[#E5B305] transition-colors"
      >
        <FaTimes className="h-6 w-6" />
      </button>

      {/* Profile Section */}
      <div className="flex-col items-center p-4 border-b border-[#E5B305]/20">
        <div className='flex justify-center items-center'>
          <img src={logo} className='w-32 h-32' alt="Baay Realty Logo" />
        </div>
        <div>
          <h2 className="text-lg font-medium">Realtor Dashboard</h2>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        <ul className="space-y-1">
          {/* Dashboard Link */}
          <li>
            <NavLink
              to="/realtor-dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaLaptop className="h-6 w-6 mr-3" />
              Dashboard
            </NavLink>
          </li>

          {/* Properties Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/properties"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <BsFillHousesFill className="h-6 w-6 mr-3" />
              Properties
            </NavLink>
          </li>

          {/* Profile Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/profile"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaUser className="h-6 w-6 mr-3" />
              Profile
            </NavLink>
          </li>

          {/* Fund Account Dropdown */}
          <li>
            <div
              className={`flex items-center p-3 cursor-pointer ${hoverStyle} ${openMenus.fundAccount ? 'bg-[#003973]' : ''}`}
              onClick={() => toggleMenu('fundAccount')}
            >
              <FaMoneyCheckAlt className="h-6 w-6 mr-3" />
              Account Payment
              <FaChevronRight className={`ml-auto transition-transform ${openMenus.fundAccount ? 'rotate-90' : ''}`} />
            </div>
            {openMenus.fundAccount && (
              <ul className="pl-6">
                <li>
                  <NavLink
                    to="/realtor-dashboard/fund-now"
                    className={({ isActive }) =>
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                    onClick={closeSidebar}
                  >
                    Upload Payment 
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/realtor-dashboard/fund-history"
                    className={({ isActive }) =>
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                    onClick={closeSidebar}
                  >
                    Payment History
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* View Team Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/view-team"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaUsers className="h-6 w-6 mr-3" />
              View Team
            </NavLink>
          </li>

          {/* View Client Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/view-clients"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaRegFileAlt className="h-6 w-6 mr-3" />
              View Client
            </NavLink>
          </li>

          {/* Withdrawal Dropdown */}
          <li>
            <div
              className={`flex items-center p-3 cursor-pointer ${hoverStyle} ${openMenus.Withdrawal ? 'bg-[#003973]' : ''}`}
              onClick={() => toggleMenu('Withdrawal')}
            >
              <FaCreditCard className="h-6 w-6 mr-3" />
              Withdrawal
              <FaChevronRight className={`ml-auto transition-transform ${openMenus.Withdrawal ? 'rotate-90' : ''}`} />
            </div>
            {openMenus.Withdrawal && (
              <ul className="pl-6">
                <li>
                  <NavLink
                    to="/realtor-dashboard/withdrawal"
                    className={({ isActive }) =>
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                    onClick={closeSidebar}
                  >
                    Request Withdraw
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/realtor-dashboard/withdraw"
                    className={({ isActive }) =>
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                    onClick={closeSidebar}
                  >
                    Withdraw Funds
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/realtor-dashboard/transactions"
                    className={({ isActive }) =>
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                    onClick={closeSidebar}
                  >
                    Transactions
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Commissions Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/commission"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaBuilding className="h-6 w-6 mr-3" />
              Commissions
            </NavLink>
          </li>

          {/* Add Testimonials Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/add-testimonials"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaFileAlt className="h-6 w-6 mr-3" />
              Add Testimonials
            </NavLink>
          </li>

          {/* FAQ Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/faq"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaQuestionCircle className="h-6 w-6 mr-3" />
              FAQ
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/realtor-dashboard/activity-log"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FiActivity className="h-6 w-6 mr-3" />
              Activity Log
            </NavLink>
          </li>

          {/* Contact Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/contact-support"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaRegBuilding className="h-6 w-6 mr-3" />
              Message
            </NavLink>
          </li>

          {/* Support Link */}
          <li>
            <NavLink
              to="/realtor-dashboard/support"
              className={({ isActive }) =>
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
              onClick={closeSidebar}
            >
              <FaFileAlt className="h-6 w-6 mr-3" />
              Contact Support
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Brand Accent */}
      <div className="mt-auto h-2 bg-[#E5B305] w-full" />
    </div>
  );
};

export default RealtorSidebar;