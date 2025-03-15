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
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";

const Dashboard = () => {
  const { user } = useAuth();
  const { items, userItems, loading, getAllItems, getUserItems } = useItems();

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    status: "",
  });

  // Fetch items on component mount
  useEffect(() => {
    if (activeTab === 0) {
      getAllItems();
    } else {
      getUserItems();
    }
  }, [activeTab, getAllItems, getUserItems]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = useCallback(() => {
    console.log("Searching with term:", searchTerm);
    console.log("Current filters:", filters);
    getAllItems({ ...filters, search: searchTerm });
  }, [getAllItems, filters, searchTerm]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filter changed: ${name} = ${value}`);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = useCallback(() => {
    console.log("Applying filters:", filters);
    console.log("With search term:", searchTerm);
    getAllItems({ ...filters, search: searchTerm });
  }, [getAllItems, filters, searchTerm]);

  const handleResetFilters = useCallback(() => {
    console.log("Resetting filters");
    setFilters({
      type: "",
      category: "",
      status: "",
    });
    setSearchTerm("");
    // Call getAllItems with empty filter object
    getAllItems({});
  }, [getAllItems]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let's find what you're looking for in the Lost and Found system.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Action Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", bgcolor: "primary.light" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom>
                    Lost Something?
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
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

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", bgcolor: "secondary.light" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom>
                    Found Something?
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
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

            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%", bgcolor: "info.light" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom>
                    Search Items
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Looking for something specific? Use the search.
                  </Typography>
                  <TextField
                    placeholder="Search items..."
                    fullWidth
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Item Type</InputLabel>
                    <Select
                      name="type"
                      value={filters.type}
                      label="Item Type"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="lost">Lost Items</MenuItem>
                      <MenuItem value="found">Found Items</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={filters.category}
                      label="Category"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Books">Books</MenuItem>
                      <MenuItem value="Clothing">Clothing</MenuItem>
                      <MenuItem value="Accessories">Accessories</MenuItem>
                      <MenuItem value="IDs">IDs</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={filters.status}
                      label="Status"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="claimed">Claimed</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="contained" onClick={handleApplyFilters}>
                      Apply Filters
                    </Button>
                    <Button variant="outlined" onClick={handleResetFilters}>
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Display active filters as chips */}
              {(filters.type ||
                filters.category ||
                filters.status ||
                searchTerm) && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mr: 1 }}
                  >
                    Active Filters:
                  </Typography>

                  {filters.type && (
                    <Chip
                      label={`Type: ${filters.type}`}
                      size="small"
                      onDelete={() => {
                        setFilters((prev) => ({ ...prev, type: "" }));
                        getAllItems({
                          ...filters,
                          type: "",
                          search: searchTerm,
                        });
                      }}
                    />
                  )}

                  {filters.category && (
                    <Chip
                      label={`Category: ${filters.category}`}
                      size="small"
                      onDelete={() => {
                        setFilters((prev) => ({ ...prev, category: "" }));
                        getAllItems({
                          ...filters,
                          category: "",
                          search: searchTerm,
                        });
                      }}
                    />
                  )}

                  {filters.status && (
                    <Chip
                      label={`Status: ${filters.status}`}
                      size="small"
                      onDelete={() => {
                        setFilters((prev) => ({ ...prev, status: "" }));
                        getAllItems({
                          ...filters,
                          status: "",
                          search: searchTerm,
                        });
                      }}
                    />
                  )}

                  {searchTerm && (
                    <Chip
                      label={`Search: ${searchTerm}`}
                      size="small"
                      onDelete={() => {
                        setSearchTerm("");
                        getAllItems({ ...filters, search: "" });
                      }}
                    />
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs & Items List */}
        <Grid item xs={12}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="All Items" />
            <Tab label="My Items" />
          </Tabs>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* Display items based on active tab */}
              {activeTab === 0 ? (
                items.length > 0 ? (
                  items.map((item) => <ItemCard key={item._id} item={item} />)
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    sx={{ my: 4 }}
                  >
                    No items found. Try adjusting your filters.
                  </Typography>
                )
              ) : userItems.length > 0 ? (
                userItems.map((item) => <ItemCard key={item._id} item={item} />)
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ my: 4 }}
                >
                  You haven't reported any items yet.
                </Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
