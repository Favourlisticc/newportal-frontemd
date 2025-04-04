import React, { useState, useEffect, useRef } from "react";
import { ArrowRightOnRectangleIcon, Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import io from 'socket.io-client';

const Navbar = ({ toggleSidebar }) => {
  const [userData, setUserData] = useState(null);
  const [birthdayMessage, setBirthdayMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [socket, setSocket] = useState(null);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle notification dropdown
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        const bellIcon = document.querySelector('.notification-bell-icon');
        if (!bellIcon || !bellIcon.contains(event.target)) {
          setShowNotifications(false);
        }
      }
      
      // Handle profile dropdown
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        const profileImage = document.querySelector('.profile-image');
        if (!profileImage || !profileImage.contains(event.target)) {
          setShowProfile(false);
        }
      }
    };

    if (showNotifications || showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfile]);

  useEffect(() => {
    const storedData = localStorage.getItem("realtorData");
    
    if (storedData) {
      const user = JSON.parse(storedData);
      setUserData(user);
      initializeSocket(user);
    }
  }, []);

  const initializeSocket = (user) => {
    console.log("Initializing socket for realtor:", user._id);
  
    const newSocket = io('https://newportal-backend.onrender.com', {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      transports: ['websocket', 'polling'],
      query: {
        userId: user._id,
        userType: 'realtor'
      }
    });
  
    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);
      console.log('Authenticating as realtor:', user._id);
      
      newSocket.emit('authenticate', {
        userId: user._id,
        userType: 'realtor',
        token: localStorage.getItem("realtorJwt")
      });
    });
  
    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });
  
    newSocket.on('reconnect_attempt', (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
    });
  
    newSocket.on('reconnect_error', (err) => {
      console.error('Reconnection error:', err.message);
    });
  
    newSocket.on('authentication_success', (data) => {
      console.log('Authentication successful:', data);
      console.log('Current socket rooms:', data.rooms || []);
    });
  
    newSocket.on('authentication_error', (err) => {
      console.error('Authentication failed:', err);
    });
  
    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });
  
    newSocket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      setNotifications(prev => [{
        ...notification,
        id: Date.now(),
        read: false
      }, ...prev]);
      setUnreadCount(prev => prev + 1);
      new Audio('/notification-sound.mp3').play().catch(console.error);
    });
  
    setSocket(newSocket);
  
    return () => {
      console.log('Cleaning up socket');
      newSocket.disconnect();
    };
  };

  useEffect(() => {
    if (userData) {
      const today = new Date();
      const userDob = new Date(userData.dob);
      if (today.getMonth() === userDob.getMonth() && today.getDate() === userDob.getDate()) {
        axios.get(`https://newportal-backend.onrender.com/realtor/birthday-message?userId=${userData._id}`)
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
  }, [userData]);

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("realtorData"));
    
      await axios.post('https://newportal-backend.onrender.com/activity/log-activity', {
        userId: user._id,
        userModel: 'Realtor',
        role: 'realtor',
        activityType: 'logout',
        description: 'Realtor logged out',
        metadata: {
          action: 'manual_logout',
          username: user.username
        }
      });
  
      if (socket) {
        socket.disconnect();
      }
      
      localStorage.removeItem("realtorData");
      localStorage.removeItem("realtorJwt");
      window.location.href = "/realtor/login";
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("realtorData");
      localStorage.removeItem("realtorJwt");
      window.location.href = "/realtor/login";
    }
  };

  const handleNotificationClick = (notification) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? {...n, read: true} : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    switch(notification.type) {
      case 'fund_approved':
      case 'fund_rejected':
        window.location.href = '/realtor-dashboard/fund-history';
        break;
      case 'withdrawal_approved':
      case 'withdrawal_rejected':
        window.location.href = '/realtor-dashboard/transactions';
        break;
      case 'new_property':
        window.location.href = '/realtor-dashboard/properties';
        break;
      case 'support_reply':
        window.location.href = `/realtor-dashboard/support`;
        break;
      case 'direct_commission':
      case 'indirect_commission':
        window.location.href = `/realtor-dashboard/commission`;
        break;
      default:
        window.location.href = '/realtor-dashboard';
    }
    
    setShowNotifications(false);
  };

  const toggleProfile = () => {
    // Only show profile dropdown on mobile
    if (window.innerWidth < 768) {
      setShowProfile(!showProfile);
    }
  };

  if (!userData) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between mx-auto">
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-[#002657] hover:text-[#E5B305] transition-colors"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* User Info Section */}
        <div className="flex items-center space-x-4 relative" ref={profileRef}>
          <div onClick={toggleProfile} className="cursor-pointer">
            {userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-[#002657] profile-image"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg profile-image"
                style={{
                  background: `linear-gradient(135deg, #002657 50%, #E5B305 50%)`,
                  border: "2px solid #002657",
                }}
              >
                {`${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()}
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <p className="text-gray-800 font-semibold">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-gray-500 text-sm">@{userData.username}</p>
          </div>

          {/* Mobile Profile Dropdown */}
          {showProfile && (
            <div className="md:hidden absolute top-12 right-0 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <div className="py-2 px-3 bg-[#002657] text-white font-semibold">
                Profile
              </div>
              <div className="p-3 border-b border-gray-100">
                <div className="font-medium text-gray-800">
                  {userData.firstName} {userData.lastName}
                </div>
                <div className="text-sm text-gray-600">@{userData.username}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 hover:bg-gray-50 text-red-600 flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Birthday Message */}
        {birthdayMessage && (
          <div className="flex items-center space-x-2 bg-[#E5B305] text-[#002657] px-4 py-2 rounded-lg">
            <span className="font-medium">{birthdayMessage}</span>
            <span className="text-2xl">🎉</span>
          </div>
        )}

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="text-[#002657] hover:text-[#E5B305] transition-colors relative notification-bell-icon"
          >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <div className="py-2 px-3 bg-[#002657] text-white font-semibold flex justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifications(prev => prev.map(n => ({...n, read: true})));
                      setUnreadCount(0);
                    }}
                    className="text-xs text-[#E5B305] hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-800">{notification.title}</div>
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
            </div>
          )}
        </div>
        
        {/* Desktop Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center space-x-2 text-[#002657] hover:text-[#E5B305] transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;