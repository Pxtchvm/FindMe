import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Avatar,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack,
    Save,
    Person
} from '@mui/icons-material';

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth();

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        mobileNumber: user?.mobileNumber || ''
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await updateProfile(formData);
            setSuccess('Profile updated successfully');
            setEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    sx={{ mr: 2 }}
                >
                    Back to Dashboard
                </Button>

                <Typography variant="h5">My Profile</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                fontSize: 48,
                                bgcolor: 'primary.main',
                                margin: '0 auto 16px'
                            }}
                        >
                            <Person fontSize="inherit" />
                        </Avatar>

                        <Typography variant="h6">
                            {user?.firstName} {user?.lastName}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                University ID
                            </Typography>
                            <Typography variant="body1">{user?.universityId}</Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Account Created
                            </Typography>
                            <Typography variant="body2">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString()
                                    : 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Personal Information</Typography>
                            {!editing && (
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={!editing || loading}
                                        variant={editing ? 'outlined' : 'filled'}
                                        InputProps={{
                                            readOnly: !editing
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={!editing || loading}
                                        variant={editing ? 'outlined' : 'filled'}
                                        InputProps={{
                                            readOnly: !editing
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!editing || loading}
                                        variant={editing ? 'outlined' : 'filled'}
                                        InputProps={{
                                            readOnly: !editing
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Mobile Number"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        disabled={!editing || loading}
                                        variant={editing ? 'outlined' : 'filled'}
                                        InputProps={{
                                            readOnly: !editing
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {editing && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setEditing(false);
                                            // Reset form to original values
                                            setFormData({
                                                firstName: user?.firstName || '',
                                                lastName: user?.lastName || '',
                                                email: user?.email || '',
                                                mobileNumber: user?.mobileNumber || ''
                                            });
                                        }}
                                        sx={{ mr: 2 }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Box>
                            )}
                        </form>

                        <Divider sx={{ my: 4 }} />

                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Account Statistics
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={4}>
                                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderRadius: 1 }}>
                                        <Typography variant="h4" color="primary.main">
                                            {/* This would be fetched from an API in a real app */}
                                            0
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Lost Items
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6} sm={4}>
                                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderRadius: 1 }}>
                                        <Typography variant="h4" color="secondary.main">
                                            {/* This would be fetched from an API in a real app */}
                                            0
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Found Items
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderRadius: 1 }}>
                                        <Typography variant="h4" color="success.main">
                                            {/* This would be fetched from an API in a real app */}
                                            0
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Claimed Items
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Profile;