import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaTimes } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';

const NotificationDropdown = ({ userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`https://newportal-backend.onrender.com/notifications/${userRole}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(`${userRole}token`)}`
          }
        });
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Set up WebSocket connection
    const userId = JSON.parse(localStorage.getItem(`${userRole}username`))._id;
    const socket = new WebSocket(`wss://newportal-backend.onrender.com?user-id=${userId}&user-role=${userRole}`);

    socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    setWs(socket);

    return () => {
      if (socket) socket.close();
    };
  }, [userRole]);

  const markAsRead = async (id) => {
    try {
      await fetch(`https://newportal-backend.onrender.com/notifications/mark-read/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(`${userRole}token`)}`
        }
      });
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`https://newportal-backend.onrender.com/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(`${userRole}token`)}`
        }
      });
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen && unreadCount > 0) markAllAsRead();
        }}
        className="p-2 relative hover:bg-gray-700 rounded-lg focus:outline-none"
      >
        <IoMdNotificationsOutline className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-gray-100">
              <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-center text-gray-500">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {notification.link && (
                      <a 
                        href={notification.link} 
                        className="text-xs text-blue-500 hover:underline mt-1 block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-200 text-center bg-gray-50">
              <Link 
                to={`/${userRole.toLowerCase()}/activities`} 
                className="text-sm text-blue-500 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                View all activities
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;