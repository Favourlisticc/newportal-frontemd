import React, { useState } from 'react';
import {
  FaHome, FaUser, FaFileAlt, FaUsers, FaMoneyCheckAlt, FaBuilding, FaQuestionCircle, FaWallet, FaChevronDown, FaChevronRight,
  FaLaptop, FaCameraRetro, FaLock, FaRegFileAlt, FaCreditCard, FaRegBuilding
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { BsFillHousesFill } from "react-icons/bs";
import logo from "../../../../public/BR (2).jpg"


const ConsultSidebar = () => {
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
    <div className="fixed top-0 left-0 w-64 h-screen bg-[#002657] text-white flex flex-col overflow-y-auto shadow-xl">
      {/* Profile Section */}
      <div className="flex-col items-center p-4 border-b border-[#E5B305]/20">
      <div className='flex justify-center items-center'>
          <img src={logo} className='w-32 h-32' alt="Baay Realty Logo" />
        </div>
        <div>
          <h2 className="text-lg font-medium">Consultant Dashboard</h2>
         
        </div>
      </div>

      <nav className="mt-6 flex-1">
        <ul className="space-y-1">
          {/* Dashboard Link */}
          <li>
            <NavLink 
              to="/consult-dashboard" 
              className={({ isActive }) => 
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
            >
              <FaLaptop className="h-6 w-6 mr-3" />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/consult-dashboard/properties" 
              className={({ isActive }) => 
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
            >
              <BsFillHousesFill className="h-6 w-6 mr-3" />
              Properties
            </NavLink>
          </li>

          {/* Profile Link */}
          <li>
            <NavLink 
              to="/consult-dashboard/profile"
              className={({ isActive }) => 
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
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
              Fund Account
              <FaChevronRight className={`ml-auto transition-transform ${openMenus.fundAccount ? 'rotate-90' : ''}`} />
            </div>
            {openMenus.fundAccount && (
              <ul className="pl-6">
                <li>
                  <NavLink 
                    to="/consult-dashboard/fund-now"
                    className={({ isActive }) => 
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                  >
                    Fund Now
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/consult-dashboard/fund-history"
                    className={({ isActive }) => 
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                  >
                    Funding History
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Genealogy Link */}
          <li>
            <NavLink 
              to="/consult-dashboard/view-team"
              className={({ isActive }) => 
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
            >
              <FaUsers className="h-6 w-6 mr-3" />
              View Team
            </NavLink>
          </li>

          {/* View Client Link */}
          <li>
            <NavLink 
              to="/consult-dashboard/view-clients"
              className={({ isActive }) => 
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
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
                    to="/consult-dashboard/withdrawal"
                    className={({ isActive }) => 
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                  >
                    Request Withdraw
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/consult-dashboard/withdraw"
                    className={({ isActive }) => 
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
                  >
                    Withdraw Funds
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/consult-dashboard/transactions"
                    className={({ isActive }) => 
                      `flex items-center p-2 text-sm ${hoverStyle} ${isActive ? activeStyle : ''}`
                    }
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
              to="/consult-dashboard/commission"
              className={({ isActive }) => 
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
            >
              <FaBuilding className="h-6 w-6 mr-3" />
              Commissions
            </NavLink>
          </li>

          {/* FAQ Link */}
          <li>
            <NavLink 
              to="/consult-dashboard/faq"
              className={({ isActive }) => 
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
            >
              <FaQuestionCircle className="h-6 w-6 mr-3" />
              FAQ
            </NavLink>
          </li>

          {/* Contact Link */}
          <li>
            <NavLink 
              to="/consult-dashboard/contact-support"
              className={({ isActive }) => 
                `flex items-center p-3 ${hoverStyle} ${isActive ? activeStyle : ''}`
              }
            >
              <FaRegBuilding className="h-6 w-6 mr-3" />
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Brand Accent */}
      <div className="mt-auto h-2 bg-[#E5B305] w-full" />
    </div>
  );
};

export default ConsultSidebar;