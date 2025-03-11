import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from '../components/notifications/NotificationItem';
import {
    Container,
    Paper,
    Typography,
    Box,
    List,
    Divider,
    Button,
    Tabs,
    Tab,
    CircularProgress,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    ArrowBack,
    MarkEmailRead,
    DarkMode
} from '@mui/icons-material';

const Notifications = () => {
    const navigate = useNavigate();
    const { notifications, loading, getNotifications, markAllAsRead } = useNotifications();

    const [activeTab, setActiveTab] = useState(0);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        getNotifications();
    }, [getNotifications]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Filter notifications based on active tab
    const filteredNotifications = notifications.filter(notification => {
        switch (activeTab) {
            case 1: // Unread
                return !notification.read;
            case 2: // Success
                return notification.type === 'success';
            case 3: // Warnings
                return notification.type === 'warning';
            case 0: // All
            default:
                return true;
        }
    });

    return (
        <Container maxWidth="md">
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mt: 2,
                    bgcolor: darkMode ? '#333' : 'background.paper',
                    color: darkMode ? 'white' : 'text.primary'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate('/')}
                            sx={{ mr: 2, color: darkMode ? 'white' : 'inherit' }}
                        >
                            Back
                        </Button>

                        <Typography variant="h5" component="h1">
                            Notifications
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={darkMode}
                                    onChange={handleToggleDarkMode}
                                    color="default"
                                />
                            }
                            label={<DarkMode />}
                            labelPlacement="start"
                        />

                        <Button
                            variant="text"
                            startIcon={<MarkEmailRead />}
                            onClick={handleMarkAllAsRead}
                            sx={{ color: darkMode ? 'white' : 'inherit' }}
                        >
                            Mark All as Read
                        </Button>
                    </Box>
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        mb: 2,
                        '& .MuiTab-root': { color: darkMode ? '#ccc' : 'inherit' },
                        '& .Mui-selected': { color: darkMode ? 'white' : 'primary.main' }
                    }}
                >
                    <Tab label="All" />
                    <Tab label="Unread" />
                    <Tab label="Approved" />
                    <Tab label="Warnings" />
                </Tabs>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress color={darkMode ? 'inherit' : 'primary'} />
                    </Box>
                ) : (
                    <List sx={{ bgcolor: darkMode ? '#444' : 'background.paper', borderRadius: 1 }}>
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification, index) => (
                                <React.Fragment key={notification._id}>
                                    <NotificationItem notification={notification} />
                                    {index < filteredNotifications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="body1" color={darkMode ? '#ccc' : 'text.secondary'}>
                                    No notifications found.
                                </Typography>
                            </Box>
                        )}
                    </List>
                )}
            </Paper>
        </Container>
    );
};

export default Notifications;