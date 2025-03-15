import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  Category,
  Person,
} from "@mui/icons-material";

// Constants
const STATUS_COLORS = {
  available: "success",
  claimed: "secondary",
  pending: "warning",
};

const ItemCard = ({ item }) => {
  const navigate = useNavigate();

  if (!item) return null;

  const {
    _id,
    category,
    description,
    date,
    location,
    status,
    type,
    photoUrl,
    reportedBy,
  } = item;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", md: "30%" },
          minWidth: { md: "250px" },
          background: "#f5f5f5",
        }}
      >
        <CardMedia
          component="img"
          image={photoUrl || "/placeholder-image.jpg"}
          alt={description}
          sx={{
            height: { xs: "200px", md: "100%" },
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=No+Image";
          }}
        />

        {/* Status & Type Indicator Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            p: 1,
          }}
        >
          <Chip
            size="small"
            color={type === "lost" ? "error" : "info"}
            label={type === "lost" ? "Lost Item" : "Found Item"}
            icon={<Category fontSize="small" />}
          />

          <Chip
            size="small"
            color={STATUS_COLORS[status] || "default"}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        </Box>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: { xs: "100%", md: "70%" },
        }}
      >
        <CardContent sx={{ flex: "1 0 auto", pb: 1 }}>
          <Typography variant="h6" gutterBottom>
            {category}
          </Typography>

          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            {description}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {location}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarToday
                  fontSize="small"
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(date)}
                </Typography>
              </Box>
            </Grid>

            {reportedBy && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Person fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Reported by: {reportedBy.firstName} {reportedBy.lastName}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => navigate(`/items/${_id}`)}
          >
            View Details
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default ItemCard;
