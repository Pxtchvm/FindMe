import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemContext";
import ItemCard from "../components/items/ItemCard";
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Divider,
  Container,
  Collapse,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

// Constants
const ITEM_TYPES = [
  { value: "", label: "All Types" },
  { value: "lost", label: "Lost Items" },
  { value: "found", label: "Found Items" },
];

const ITEM_CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Books", label: "Books" },
  { value: "Clothing", label: "Clothing" },
  { value: "Accessories", label: "Accessories" },
  { value: "IDs", label: "IDs" },
  { value: "Others", label: "Others" },
];

const ITEM_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "available", label: "Available" },
  { value: "claimed", label: "Claimed" },
  { value: "pending", label: "Pending" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { items, userItems, loading, getAllItems, getUserItems } = useItems();

  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    status: "",
  });
  const [showFilters, setShowFilters] = useState(true);

  // Load items on component mount or tab change
  useEffect(() => {
    if (activeTab === 0) {
      getAllItems();
    } else {
      getUserItems();
    }
  }, [activeTab, getAllItems, getUserItems]);

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = useCallback(() => {
    getAllItems({ ...filters, search: searchTerm });
  }, [getAllItems, filters, searchTerm]);

  const handleApplyFilters = useCallback(() => {
    getAllItems({ ...filters, search: searchTerm });
  }, [getAllItems, filters, searchTerm]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      type: "",
      category: "",
      status: "",
    });
    setSearchTerm("");
    getAllItems({});
  }, [getAllItems]);

  const removeFilter = useCallback(
    (filterName) => {
      setFilters((prev) => ({ ...prev, [filterName]: "" }));
      getAllItems({ ...filters, [filterName]: "", search: searchTerm });
    },
    [getAllItems, filters, searchTerm]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    getAllItems({ ...filters, search: "" });
  }, [getAllItems, filters]);

  // Renders
  const renderActionCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Lost Item Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            height: "100%",
            bgcolor: "primary.light",
            borderRadius: 2,
            boxShadow: 2,
            transition: "box-shadow 0.3s",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Lost Something?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Report a lost item to help others find it for you.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/report-item"
              state={{ type: "lost" }}
              startIcon={<AddIcon />}
            >
              Report Lost Item
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Found Item Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            height: "100%",
            bgcolor: "secondary.light",
            borderRadius: 2,
            boxShadow: 2,
            transition: "box-shadow 0.3s",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Found Something?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Report a found item to help return it to its owner.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/report-item"
              state={{ type: "found" }}
              startIcon={<AddIcon />}
            >
              Report Found Item
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Search Card */}
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            height: "100%",
            bgcolor: "info.light",
            borderRadius: 2,
            boxShadow: 2,
            transition: "box-shadow 0.3s",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Search Items
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Looking for something specific? Use the search.
            </Typography>
            <TextField
              placeholder="Search items..."
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFilterPanel = () => (
    <Box sx={{ mb: 4 }}>
      <Button
        startIcon={<FilterListIcon />}
        onClick={() => setShowFilters((prev) => !prev)}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={1}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterListIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Filter Items</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {/* Type Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Item Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  label="Item Type"
                  onChange={handleFilterChange}
                >
                  {ITEM_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  label="Category"
                  onChange={handleFilterChange}
                >
                  {ITEM_CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  {ITEM_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Filter Buttons */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  startIcon={<SearchIcon />}
                  sx={{ flexGrow: 1 }}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  startIcon={<RefreshIcon />}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Active Filter Chips */}
          {(filters.type ||
            filters.category ||
            filters.status ||
            searchTerm) && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3 }}>
              <Typography variant="body2" sx={{ mr: 1, pt: 0.5 }}>
                Active Filters:
              </Typography>

              {filters.type && (
                <Chip
                  label={`Type: ${filters.type}`}
                  size="small"
                  color="primary"
                  onDelete={() => removeFilter("type")}
                />
              )}

              {filters.category && (
                <Chip
                  label={`Category: ${filters.category}`}
                  size="small"
                  color="primary"
                  onDelete={() => removeFilter("category")}
                />
              )}

              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  size="small"
                  color="primary"
                  onDelete={() => removeFilter("status")}
                />
              )}

              {searchTerm && (
                <Chip
                  label={`Search: ${searchTerm}`}
                  size="small"
                  color="primary"
                  onDelete={clearSearch}
                />
              )}
            </Box>
          )}
        </Paper>
      </Collapse>
    </Box>
  );

  const renderItemsList = () => {
    // Get the current items based on active tab
    const currentItems = activeTab === 0 ? items : userItems;

    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (currentItems.length === 0) {
      return (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "background.default",
            borderRadius: 2,
          }}
          elevation={0}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {activeTab === 0
              ? "No items found. Try adjusting your filters."
              : "You haven't reported any items yet."}
          </Typography>

          {activeTab === 1 && (
            <Button
              variant="contained"
              component={Link}
              to="/report-item"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Report an Item
            </Button>
          )}
        </Paper>
      );
    }

    return currentItems.map((item) => <ItemCard key={item._id} item={item} />);
  };

  return (
    <Container>
      <Box sx={{ py: 3 }}>
        {/* Welcome Message */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.firstName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Let's find what you're looking for in the Lost and Found system.
          </Typography>
        </Box>

        {/* Action Cards */}
        {renderActionCards()}

        {/* Filter Panel */}
        {renderFilterPanel()}

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2 }} elevation={1}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="All Items" />
            <Tab label="My Items" />
          </Tabs>
        </Paper>

        {/* Items List */}
        {renderItemsList()}
      </Box>
    </Container>
  );
};

export default Dashboard;
