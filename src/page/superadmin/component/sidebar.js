import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaMoneyBill, FaCoins, FaBirthdayCake, FaBuilding, FaQuestionCircle, FaWallet, FaChevronRight, FaLaptop, FaFileContract, FaHandshake, FaRegChartBar, FaStore, FaComments, FaPlusSquare, FaListAlt, FaDollarSign, FaCheckCircle, FaTimesCircle, FaSpinner, FaUserShield, FaUserCog, FaTimes } from 'react-icons/fa';
import { RiAccountPinBoxFill } from "react-icons/ri";
import { MdSupervisorAccount } from "react-icons/md";
import { MdGppGood } from "react-icons/md";
import logo from "../../../public/BR (2).jpg";
import { FiActivity } from "react-icons/fi";

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const isLinkActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/superadmin-dashboard',
      icon: <FaLaptop className="h-5 w-5 mr-3" />,
      exact: true
    },
    {
      name: 'Commissions',
      path: '/superadmin-dashboard/commissions',
      icon: <FaCoins className="h-5 w-5 mr-3" />
    },
    {
      name: 'Funding',
      path: '/superadmin-dashboard/funding',
      icon: <FaCoins className="h-5 w-5 mr-3" />
    },
    {
      name: 'View Realtors',
      path: '/superadmin-dashboard/view-realtors',
      icon: <RiAccountPinBoxFill className="h-5 w-5 mr-3" />
    },
    {
      name: 'View Clients',
      path: '/superadmin-dashboard/view-client',
      icon: <MdSupervisorAccount className="h-5 w-5 mr-3" />
    },
    {
      name: 'Admin Management',
      path: '/superadmin-dashboard/admin-management',
      icon: <FaUserShield className="h-5 w-5 mr-3" />
    },
    {
      name: 'Birthday',
      icon: <FaBirthdayCake className="h-5 w-5 mr-3" />,
      subItems: [
        { name: 'Birthday Message', path: '/superadmin-dashboard/birthday-message' },
        { name: "Today's Birthdays", path: '/superadmin-dashboard/todays-birthdays' }
      ]
    },
    {
      name: 'Properties Sales',
      icon: <FaStore className="h-5 w-5 mr-3" />,
      subItems: [
        { name: 'Pending Sales', path: '/superadmin-dashboard/pending-sales' },
        { name: 'Approved Sales', path: '/superadmin-dashboard/approved-sales' },
        { name: 'Incomplete Payment', path: '/superadmin-dashboard/unbalanced-sales' },
        { name: 'Rejected Sales', path: '/superadmin-dashboard/rejected-sales' }
      ]
    },
    {
      name: 'Withdrawal',
      path: '/superadmin-dashboard/withdrawal',
      icon: <FaWallet className="h-5 w-5 mr-3" />
    },
    {
      name: 'FAQ',
      icon: <FaQuestionCircle className="h-5 w-5 mr-3" />,
      subItems: [
        { name: 'Add FAQ', path: '/superadmin-dashboard/add-faq' },
        { name: 'View FAQ', path: '/superadmin-dashboard/view-faq' }
      ]
    },
    {
      name: 'Properties',
      icon: <FaBuilding className="h-5 w-5 mr-3" />,
      subItems: [
        { name: 'Add Property', path: '/superadmin-dashboard/add-property' },
        { name: 'View Properties', path: '/superadmin-dashboard/view-properties' }
      ]
    },
    {
          name: 'Activity',
          path: '/superadmin-dashboard/activity-log',
          icon: <FiActivity className="h-5 w-5 mr-3" />
        },
    {
      name: 'Messages',
      path: '/superadmin-dashboard/messages',
      icon: <FaComments className="h-5 w-5 mr-3" />
    },
    {
      name: 'Testimonials',
      path: '/superadmin-dashboard/testimonials',
      icon: <MdGppGood className="h-5 w-5 mr-3" />
    }
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-screen bg-gray-800 text-gray-100 flex flex-col overflow-y-auto shadow-xl transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-20`}
    >
      {/* Close Icon for Mobile */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
          <FaTimes className="h-6 w-6" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center justify-center p-4 border-b border-gray-700">
        <div>
          <div className='flex justify-center items-center mt-8'>
            <img src={logo} className='w-32 h-32' />
          </div>
          <h2 className="text-gray-400">Super Administrator</h2>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center p-3 hover:bg-gray-700 ${
                    isLinkActive(item.path) ? 'bg-[#002657]' : ''
                  }`}
                  onClick={toggleSidebar} // Close sidebar on mobile when a link is clicked
                >
                  {React.cloneElement(item.icon, {
                    style: { color: isLinkActive(item.path) ? '#E5B30F' : 'inherit' }
                  })}
                  <span className={isLinkActive(item.path) ? 'text-[#E5B30F]' : ''}>
                    {item.name}
                  </span>
                </Link>
              ) : (
                <>
                  <div
                    className={`flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer ${
                      item.subItems.some(sub => isLinkActive(sub.path)) ? 'bg-[#002657]' : ''
                    }`}
                    onClick={() => toggleMenu(item.name)}
                  >
                    <div className="flex items-center">
                      {React.cloneElement(item.icon, {
                        style: { color: item.subItems.some(sub => isLinkActive(sub.path)) ? '#E5B30F' : 'inherit' }
                      })}
                      <span className={item.subItems.some(sub => isLinkActive(sub.path)) ? 'text-[#E5B30F]' : ''}>
                        {item.name}
                      </span>
                    </div>
                    <FaChevronRight
                      className={`transition-transform ${
                        openMenus[item.name] || item.subItems.some(sub => isLinkActive(sub.path)) ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                  {(openMenus[item.name] || item.subItems.some(sub => isLinkActive(sub.path))) && (
                    <ul className="pl-9 bg-gray-750">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path}
                            className={`flex items-center p-2 hover:bg-gray-700 ${
                              isLinkActive(subItem.path) ? 'bg-[#002657]' : ''
                            }`}
                            onClick={toggleSidebar} // Close sidebar on mobile when a link is clicked
                          >
                            <span className={`ml-3 ${isLinkActive(subItem.path) ? 'text-[#E5B30F]' : ''}`}>
                              {subItem.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};


export default AdminSidebar;