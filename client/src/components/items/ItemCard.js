import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Button,
  Grid,
} from "@mui/material";
import { LocationOn, CalendarToday, Category } from "@mui/icons-material";

// Default image for items without photos
const DEFAULT_IMAGE = "https://placehold.co/150?text=No+Image";

const ItemCard = ({ item }) => {
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "success";
      case "claimed":
        return "secondary";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Card sx={{ mb: 2, position: "relative", overflow: "visible" }}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <CardMedia
            component="img"
            height="140"
            image={item.photoUrl || DEFAULT_IMAGE}
            alt={item.description}
            sx={{ objectFit: "cover" }}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  {item.category}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {item.description}
                </Typography>

                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}
                >
                  <Chip
                    icon={<LocationOn fontSize="small" />}
                    label={item.location}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    icon={<CalendarToday fontSize="small" />}
                    label={formatDate(item.date)}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    icon={<Category fontSize="small" />}
                    label={item.type === "lost" ? "Lost Item" : "Found Item"}
                    size="small"
                    variant="outlined"
                    color={item.type === "lost" ? "error" : "info"}
                  />
                </Box>
              </Box>

              <Chip
                label={
                  item.status.charAt(0).toUpperCase() + item.status.slice(1)
                }
                color={getStatusColor(item.status)}
                sx={{ textTransform: "capitalize" }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate(`/items/${item._id}`)}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ItemCard;
