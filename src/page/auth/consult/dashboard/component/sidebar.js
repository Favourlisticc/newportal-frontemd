import React, { useState } from 'react';
import {
  FaHome, FaUser, FaFileAlt, FaUsers, FaMoneyCheckAlt, FaBuilding, FaQuestionCircle, FaWallet, FaChevronDown, FaChevronRight,
  FaLaptop, FaCameraRetro, FaLock, FaRegFileAlt, FaCreditCard, FaRegBuilding
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white flex flex-col overflow-y-auto"> {/* Fixed Positioning and Overflow */}
      {/* Profile Section */}
      <div className="flex items-center p-4">
        <img src="/path/to/profile/image" alt="Profile" className="rounded-full h-12 w-12 mr-4" />
        <div>
          <h2 className="text-lg font-medium">User Name</h2>
          <p className="text-sm">User Role</p>
        </div>
      </div>

      <nav className="mt-10 flex-1">
        <ul>
          {/* Main Website Link */}
          <li className="flex items-center p-3 hover:bg-gray-700">
            <Link to="/" className="flex items-center">
              <FaHome className="h-6 w-6 mr-3" />
              Main Website
            </Link>
          </li>

          {/* Dashboard Link */}
          <li className="flex items-center p-3 hover:bg-gray-700">
            <Link to="/dashboard" className="flex items-center">
              <FaLaptop className="h-6 w-6 mr-3" />
              Dashboard
            </Link>
          </li>

          {/* Profile Dropdown */}
          <li className="flex items-center p-3 hover:bg-gray-700" onClick={() => toggleMenu('profile')}>
            <FaUser className="h-6 w-6 mr-3" /> Profile
            <FaChevronRight className={`ml-auto transition-transform ${openMenus.profile ? 'rotate-90' : ''}`} />
          </li>
          {openMenus.profile && (
            <ul className="pl-6">
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/profile">My Profile</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/change-password">Change Password</Link>
              </li>
            </ul>
          )}

          {/* Statutory Dropdown */}
          <li className="flex items-center p-3 hover:bg-gray-700" onClick={() => toggleMenu('statutory')}>
            <FaRegFileAlt className="h-6 w-6 mr-3" /> Statutory
            <FaChevronRight className={`ml-auto transition-transform ${openMenus.statutory ? 'rotate-90' : ''}`} />
          </li>
          {openMenus.statutory && (
            <ul className="pl-6">
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/all-statutory">All Statutory</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/paid-statutory">Paid Statutory</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/unpaid-statutory">Unpaid Statutory</Link>
              </li>
            </ul>
          )}

          {/* Fund Account Dropdown */}
          <li className="flex items-center p-3 hover:bg-gray-700" onClick={() => toggleMenu('fundAccount')}>
            <FaMoneyCheckAlt className="h-6 w-6 mr-3" /> Fund Account
            <FaChevronRight className={`ml-auto transition-transform ${openMenus.fundAccount ? 'rotate-90' : ''}`} />
          </li>
          {openMenus.fundAccount && (
            <ul className="pl-6">
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/fund-now">Fund Now</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/funding-history">Funding History</Link>
              </li>
            </ul>
          )}

          {/* Withdrawal Dropdown */}
          <li className="flex items-center p-3 hover:bg-gray-700" onClick={() => toggleMenu('withdrawal')}>
            <FaWallet className="h-6 w-6 mr-3" /> Withdrawal
            <FaChevronRight className={`ml-auto transition-transform ${openMenus.withdrawal ? 'rotate-90' : ''}`} />
          </li>
          {openMenus.withdrawal && (
            <ul className="pl-6">
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/withdraw-funds">Withdraw Funds</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/pending-withdrawal">Pending Withdrawal</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/approved-withdrawal">Approved Withdrawal</Link>
              </li>
            </ul>
          )}

          {/* Properties Dropdown */}
          <li className="flex items-center p-3 hover:bg-gray-700" onClick={() => toggleMenu('properties')}>
            <FaBuilding className="h-6 w-6 mr-3" /> Properties
            <FaChevronRight className={`ml-auto transition-transform ${openMenus.properties ? 'rotate-90' : ''}`} />
          </li>
          {openMenus.properties && (
            <ul className="pl-6">
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/view-properties">View Properties</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/my-paid-commissions">My Paid Commissions</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/my-pending-commissions">My Pending Commissions</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/my-transactions">My Transactions</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/part-payments">Part Payments</Link>
              </li>
            </ul>
          )}


          {/* FAQ Link */}
          <li className="flex items-center p-3 hover:bg-gray-700">
            <Link to="/faq" className="flex items-center">
              <FaQuestionCircle className="h-6 w-6 mr-3" />
              FAQ
            </Link>
          </li>

          {/* Payments Dropdown */}
          <li className="flex items-center p-3 hover:bg-gray-700" onClick={() => toggleMenu('payments')}>
            <FaCreditCard className="h-6 w-6 mr-3" /> Payments
            <FaChevronRight className={`ml-auto transition-transform ${openMenus.payments ? 'rotate-90' : ''}`} />
          </li>
          {openMenus.payments && (
            <ul className="pl-6">
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/payments-owed">Payments Owed</Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/payments-made">Payments Made</Link>
              </li>
            </ul>
          )}

          {/* Properties Owned Dropdown */}
          <li className="flex items-center p-3 hover:bg-gray-700" onClick={() => toggleMenu('propertiesOwned')}>
            <FaRegBuilding className="h-6 w-6 mr-3" /> Properties Owned
            <FaChevronRight className={`ml-auto transition-transform ${openMenus.propertiesOwned ? 'rotate-90' : ''}`} />
          </li>
          {openMenus.propertiesOwned && (
            <ul className="pl-6">
              <li className="flex items-center p-2 hover:bg-gray-700">
                <Link to="/view-owned-properties">View Owned Properties</Link>
              </li>
            </ul>
          )}

        </ul>
      </nav>
    </div>
  );
};

export default ConsultSidebar;