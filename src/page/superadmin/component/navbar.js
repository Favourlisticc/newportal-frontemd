import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa';
import axios from "axios";
import io from 'socket.io-client';

const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const socketRef = useRef(null);
  
  useEffect(() => {
    // Connect to websocket server
    socketRef.current = io('https://newportal-backend.onrender.com');
    
    // Listen for notifications
    socketRef.current.on('notification', (notification) => {
      // Add new notification to the state
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prevCount => prevCount + 1);
    });
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
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
      const user = JSON.parse(localStorage.getItem('SuperAdminusername'));
      
      // Log activity
      await axios.post('https://newportal-backend.onrender.com/activity/log-activity', {
        userId: user._id,
        userModel: 'SuperAdmin',
        role: 'superadmin',
        activityType: 'logout',
        description: 'SuperAdmin logged out',
        metadata: {
          action: 'manual_logout',
          lastActivity: new Date().toISOString()
        }
      });
  
      localStorage.removeItem('SuperAdmintoken');
      localStorage.removeItem('SuperAdminusername');
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging activity:', error);
      // Still proceed with logout
      localStorage.removeItem('SuperAdmintoken');
      localStorage.removeItem('SuperAdminusername');
      navigate('/admin/login');
    }
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark notifications as read when opening the panel
      setUnreadCount(0);
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

      <h1 className="text-xl font-semibold">SuperAdmin Dashboard</h1>
      
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