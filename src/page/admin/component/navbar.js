import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa';
import axios from "axios";
import io from 'socket.io-client';

const AdminNavbar = ({ toggleSidebar }) => {
const navigate = useNavigate();
const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);
const socketRef = useRef(null);

// In your AdminNavbar component
// In your AdminNavbar component

const notificationRef = useRef(null);



useEffect(() => {
  const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://newportal-backend.onrender.com'
  : 'http://localhost:3005';

const socket = io(SOCKET_URL, {
  withCredentials: true,
  reconnection: true
});

  // Authenticate as admin
  socket.emit('authenticate', { userType: 'admin' });

  // Listen specifically for admin notifications
  socket.on('admin_notification', (notification) => {
    console.log('Received admin notification:', notification);
    setNotifications(prev => [{
      ...notification,
      id: Date.now(),
      read: false
    }, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Play notification sound
    new Audio('/notification-sound.mp3').play().catch(e => console.log(e));
  });

  return () => {
    socket.disconnect();
  };
}, []);


useEffect(() => {
  // Handle clicks outside the notification panel
  function handleClickOutside(event) {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  }
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

const handleLogout = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('Adminusername'));
    
    // Log activity
    await axios.post('https://newportal-backend.onrender.com/activity/log-activity', {
      userModel: 'Admin',
      role: 'admin',
      activityType: 'logout',
      description: 'Admin logged out',
      metadata: {
        action: 'manual_logout',
        adminType: user.adminType
      }
    });

    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('Adminusername');
    navigate('/admin/login');
  } catch (error) {
    console.error('Error logging activity:', error);
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('Adminusername');
    navigate('/admin/login');
  }
};

const toggleNotifications = () => {
  setShowNotifications(!showNotifications);
  if (!showNotifications && unreadCount > 0) {
    // Mark notifications as read when opening the panel
    setUnreadCount(0);
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }
};
  
  const handleNotificationClick = (notification) => {
    // Navigate based on notification type
    switch (notification.type) {
      case 'registration':
        navigate('/admin/realtors');
        break;
      case 'withdrawal':
        navigate('/admin/withdrawal-requests');
        break;
      case 'payment':
        navigate('/admin/payments');
        break;
      case 'testimonial':
        navigate('/admin/testimonials');
        break;
      case 'purchase':
        navigate('/admin/purchases');
        break;
        case 'support':
          case 'support_message':
            navigate(`/admin/support-tickets/${notification.ticketId}`);
            break;
        case 'registration':
            navigate(`/admin/clients/${notification.userId}`);
            break;
      default:
        navigate('/admin/dashboard');

    }
    setShowNotifications(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gray-800 text-gray-100 flex items-center justify-between px-6 shadow-lg z-10 md:left-64">
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-700 rounded-lg focus:outline-none md:hidden"
      >
        <FaBars className="h-6 w-6" />
      </button>

      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      
      <div className="flex items-center">
        {/* Notification Bell */}
        <div className="relative mr-4" ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 hover:bg-gray-700 rounded-lg focus:outline-none relative"
          >
            <FaBell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
              <div className="py-2 px-3 bg-gray-800 text-white font-semibold">
                Notifications
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div 
                      key={index}
                      onClick={() => handleNotificationClick(notification)}
                      className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="font-semibold text-gray-800">{notification.title}</div>
                      <div className="text-sm text-gray-600">{notification.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
              
              <div className="py-2 px-3 bg-gray-100 text-center">
                <button 
                  onClick={() => {
                    navigate('/admin/activities');
                    setShowNotifications(false);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Activity
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-700 rounded-lg focus:outline-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;