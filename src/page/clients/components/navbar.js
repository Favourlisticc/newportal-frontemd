import { FiLogOut, FiMenu, FiBell, FiX, FiChevronDown } from "react-icons/fi";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import io from 'socket.io-client';

const Navbar = ({ onToggleSidebar }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [birthdayMessage, setBirthdayMessage] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [socket, setSocket] = useState(null);
  const [socketInitialized, setSocketInitialized] = useState(false);

  const notificationRef = useRef(null);
  const profileDropdownRef = useRef(null);

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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        const profileImage = document.querySelector('.profile-image-trigger');
        if (!profileImage || !profileImage.contains(event.target)) {
          setShowProfileDropdown(false);
        }
      }
    };

    if (showNotifications || showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfileDropdown]);

  useEffect(() => {
    const storedUser = localStorage.getItem("Clientuser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (user && !socketInitialized) {
      initializeSocket(user);
      setSocketInitialized(true);
    }

    return () => {
      if (socket) {
        console.log('Cleaning up socket');
        socket.disconnect();
      }
    };
  }, [user, socketInitialized]);

  const initializeSocket = (userData) => {
    if (!userData?._id) {
      console.error("Cannot initialize socket - user ID missing");
      return;
    }

    console.log("Initializing socket for client:", userData._id);

    const newSocket = io('https://newportal-backend.onrender.com', {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      transports: ['websocket', 'polling'],
      query: {
        userId: userData._id,
        userType: 'client'
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);
      console.log('Authenticating as client:', userData._id);
      
      newSocket.emit('authenticate', { 
        userId: userData._id, 
        userType: 'client',
        token: localStorage.getItem("Clienttoken")
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
    });

    newSocket.on('authentication_error', (err) => {
      console.error('Authentication failed:', err);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    newSocket.on('notification', (notification) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [{
        ...notification,
        id: Date.now(),
        read: false
      }, ...prev]);
      setUnreadCount(prev => prev + 1);
      new Audio('/notification-sound.mp3').play().catch(console.error);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    if (user) {
      const today = new Date();
      const userDob = new Date(user.dateOfBirth);
      
      if (today.getMonth() === userDob.getMonth() && today.getDate() === userDob.getDate()) {
        fetchBirthdayMessage();
      }
    }
  }, [user]);

  const fetchBirthdayMessage = async () => {
    try {
      const response = await axios.get(
        `https://newportal-backend.onrender.com/client/birthday-message?userId=${user._id}`
      );
      if (response.data.message) {
        setBirthdayMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching birthday message:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    switch(notification.type) {
      case 'purchase_confirmed':
        navigate(`/client/purchases/${notification.purchaseId}`);
        break;
      case 'support_reply':
        navigate(`/client/support-tickets/${notification.ticketId}`);
        break;
      default:
        navigate('/client/dashboard');
    }
    
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("Clientuser"));
      
      await axios.post('https://newportal-backend.onrender.com/activity/log-activity', {
        userId: user._id,
        userModel: 'client',
        role: 'client',
        activityType: 'logout',
        description: 'You logged out',
        metadata: {
          action: 'manual_logout',
        }
      });
  
      if (socket) {
        socket.disconnect();
      }
      
      localStorage.removeItem("Clienttoken");
      localStorage.removeItem("Clientuser");
      window.location.href = "/client/login";
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("Clienttoken");
      localStorage.removeItem("Clientuser");
      window.location.href = "/client/login";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="bg-[#002657] shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="text-white hover:text-[#E5B305] transition lg:hidden"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          {birthdayMessage && (
            <div className="hidden md:flex items-center space-x-2 bg-[#E5B305] text-[#002657] px-4 py-2 rounded-lg">
              <span className="font-medium">{birthdayMessage}</span>
              <span className="text-2xl">🎉</span>
            </div>
          )}
        </div>

        {/* Middle section */}
        <div className="hidden md:block">
          <Link to="/client/dashboard" className="text-white font-bold text-xl">
            Client Portal
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="notification-bell-icon text-white hover:text-[#E5B305] transition relative"
              aria-label="Notifications"
            >
              <FiBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 md:w-96 bg-white rounded-md shadow-lg overflow-hidden z-50">
                <div className="flex justify-between items-center bg-[#002657] p-3">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <div className="flex space-x-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-[#E5B305] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-white hover:text-[#E5B305]"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <p className="font-medium text-[#002657]">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.timestamp || Date.now())}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        {notification.type === 'purchase_confirmed' && (
                          <p className="text-xs text-[#E5B305] mt-1">
                            Purchase ID: {notification.purchaseId}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile and Logout */}
          <div className="relative" ref={profileDropdownRef}>
            {/* Mobile Profile Dropdown Trigger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="profile-image-trigger flex items-center"
              >
                <img
                  src={user?.passportPhoto || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-[#E5B305] object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
                <FiChevronDown 
                  className={`ml-1 text-white transition-transform duration-200 ${
                    showProfileDropdown ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex items-center space-x-3">
              <img
                src={user?.passportPhoto || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#E5B305] object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40";
                }}
              />
              <div className="hidden md:block">
                <p className="text-white font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-[#E5B305] text-sm">@{user?.username}</p>
              </div>
            </div>

            {/* Mobile Profile Dropdown */}
            {showProfileDropdown && (
              <div className="md:hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user?.passportPhoto || "https://via.placeholder.com/40"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-[#E5B305] object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[#E5B305] text-sm">@{user?.username}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
                >
                  <FiLogOut className="text-gray-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Desktop Logout Button */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center space-x-2 text-white hover:text-[#E5B305] transition"
            aria-label="Logout"
          >
            <FiLogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile birthday message */}
      {birthdayMessage && (
        <div className="md:hidden bg-[#E5B305] text-[#002657] px-4 py-2 text-center">
          <span className="font-medium">{birthdayMessage}</span>
          <span className="ml-2">🎉</span>
        </div>
      )}
    </header>
  );
};

export default Navbar;