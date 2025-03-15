import React from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import {
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  MarkEmailRead as MarkReadIcon,
} from "@mui/icons-material";

const NotificationItem = ({ notification }) => {
  const { markAsRead } = useNotifications();

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <SuccessIcon color="success" />;
      case "warning":
        return <WarningIcon color="warning" />;
      case "info":
      default:
        return <InfoIcon color="info" />;
    }
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    markAsRead(notification._id);
  };

  return (
    <>
      <ListItem
        alignItems="flex-start"
        secondaryAction={
          !notification.read && (
            <IconButton
              edge="end"
              aria-label="mark as read"
              onClick={handleMarkAsRead}
              size="small"
            >
              <MarkReadIcon />
            </IconButton>
          )
        }
        sx={{
          backgroundColor: notification.read
            ? "inherit"
            : "rgba(25, 118, 210, 0.08)",
          transition: "background-color 0.3s",
        }}
      >
        <ListItemButton
          component={notification.relatedItem ? Link : undefined}
          to={
            notification.relatedItem
              ? `/items/${notification.relatedItem}`
              : undefined
          }
          sx={{ paddingY: 1 }}
        >
          <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>

          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                fontWeight={notification.read ? "normal" : "bold"}
              >
                {notification.title}
              </Typography>
            }
            secondary={
              <Box>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mt: 0.5 }}
                >
                  {notification.message}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {formatDate(notification.createdAt)}
                </Typography>
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default NotificationItem;
