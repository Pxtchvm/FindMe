import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get user notifications
  const getNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users/notifications");
      setNotifications(res.data);

      // Count unread notifications
      const unread = res.data.filter(
        (notification) => !notification.read,
      ).length;
      setUnreadCount(unread);

      return res.data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const res = await axios.put(`/api/users/notifications/${id}`);

      // Update notifications list
      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      return res.data;
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const res = await axios.put("/api/users/notifications");

      // Update all notifications as read
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true })),
      );

      // Reset unread count
      setUnreadCount(0);

      return res.data;
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    getNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
