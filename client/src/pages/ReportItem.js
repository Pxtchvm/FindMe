import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import { PhotoCamera, Save, ArrowBack } from '@mui/icons-material';

const ReportItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { createItem } = useItems();

    // Get item type from location state (if available)
    const initialType = location.state?.type || 'lost';

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        type: initialType,
        photoUrl: '',
        contactInfo: '',
        notes: ''
    });

    const [itemType, setItemType] = useState(initialType);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleTypeChange = (event, newType) => {
        if (newType !== null) {
            setItemType(newType);
            setFormData({
                ...formData,
                type: newType
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.category || !formData.description || !formData.date || !formData.location) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await createItem(formData);
            setSuccess(true);

            // Reset form
            setFormData({
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                location: '',
                type: itemType,
                photoUrl: '',
                contactInfo: '',
                notes: ''
            });

            // Redirect after short delay
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Failed to report item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                    >
                        Back to Dashboard
                    </Button>

                    <Typography variant="h5" component="h1">
                        {itemType === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <ToggleButtonGroup
                    value={itemType}
                    exclusive
                    onChange={handleTypeChange}
                    aria-label="item type"
                    sx={{ mb: 3, width: '100%' }}
                >
                    <ToggleButton value="lost" color="primary" sx={{ width: '50%' }}>
                        Lost Item
                    </ToggleButton>
                    <ToggleButton value="found" color="secondary" sx={{ width: '50%' }}>
                        Found Item
                    </ToggleButton>
                </ToggleButtonGroup>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Category *"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                <MenuItem value="">Select a category</MenuItem>
                                <MenuItem value="Electronics">Electronics</MenuItem>
                                <MenuItem value="Books">Books</MenuItem>
                                <MenuItem value="Clothing">Clothing</MenuItem>
                                <MenuItem value="Accessories">Accessories</MenuItem>
                                <MenuItem value="IDs">IDs</MenuItem>
                                <MenuItem value="Others">Others</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Location *"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="Where lost/found? (e.g., Library, Room 203)"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date *"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Contact Information"
                                name="contactInfo"
                                value={formData.contactInfo}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Phone or email for contact"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Photo URL"
                                name="photoUrl"
                                value={formData.photoUrl}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Link to a photo of the item (if available)"
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            component="label"
                                            startIcon={<PhotoCamera />}
                                            sx={{ minWidth: 'auto', ml: 1 }}
                                        >
                                            Upload
                                            <input
                                                type="file"
                                                hidden
                                            // Note: In a real implementation, you would handle file upload to a storage service
                                            // and get the URL to store in formData.photoUrl
                                            />
                                        </Button>
                                    ),
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Note: Uploads not fully implemented in this demo. Please provide a URL to an existing image.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Description *"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                required
                                multiline
                                rows={3}
                                placeholder="Describe the item in detail (color, brand, identifiable features, etc.)"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Additional Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Any additional information that might help"
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/')}
                                sx={{ mr: 2 }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color={itemType === 'lost' ? 'primary' : 'secondary'}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                            >
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Item reported successfully! Redirecting to dashboard...
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ReportItem;