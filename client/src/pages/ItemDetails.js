import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItems } from "../context/ItemContext";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Divider,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  CalendarToday,
  Person,
  Phone,
  Delete,
  Edit,
  Check,
  Close,
} from "@mui/icons-material";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentItem,
    loading: contextLoading,
    getItemById,
    deleteItem,
    claimItem,
    processClaim,
  } = useItems();

  // Add local state to control the component rendering
  const [localLoading, setLocalLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [processAction, setProcessAction] = useState(null);

  // Create a stable fetch function with useCallback
  const fetchItemData = useCallback(async () => {
    setLocalLoading(true);
    try {
      const data = await getItemById(id);
      setItem(data);
      setError("");
    } catch (err) {
      console.log("Error caught in component:", err);
      setError("Unable to load item details. Please try again later.");
      setItem(null);
    } finally {
      setLocalLoading(false);
    }
  }, [id, getItemById]);

  // Fetch data only once when component mounts or ID changes
  useEffect(() => {
    fetchItemData();

    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [fetchItemData]);

  // Default image for items without photos
  const DEFAULT_IMAGE = "https://placehold.co/400x300?text=No+Image";

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle loading state
  if (localLoading || contextLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  // Handle missing item
  if (!item) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 2 }}>
          Item not found or has been removed.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  // Improved check for item ownership that handles different data structures
  const isOwner =
    item &&
    user &&
    // If reportedBy is a populated object with _id
    ((item.reportedBy._id && item.reportedBy._id.toString() === user.id) ||
      // If reportedBy is just the ID string
      (typeof item.reportedBy === "string" && item.reportedBy === user.id) ||
      // If reportedBy is an ObjectId directly
      (item.reportedBy.toString && item.reportedBy.toString() === user.id));

  // Check if user can claim (not owner, item available, and not already claimed)
  const canClaim = item && user && !isOwner && item.status === "available";

  // Check if user can process a claim
  const canProcessClaim = item && isOwner && item.status === "pending";

  // For debugging - add this near the top of your returned JSX
  console.log({
    itemId: id,
    reportedBy: item.reportedBy,
    reportedById: item.reportedBy._id
      ? item.reportedBy._id.toString()
      : item.reportedBy,
    userId: user.id,
    isOwner,
    itemStatus: item.status,
    canProcessClaim,
  });

  // Handle item deletion
  const handleDelete = async () => {
    try {
      await deleteItem(id);
      setSuccess("Item deleted successfully");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to delete item");
      setDeleteDialogOpen(false);
    }
  };

  // Handle claim request
  const handleClaim = async () => {
    try {
      await claimItem(id);
      setSuccess("Claim request submitted successfully");
      setClaimDialogOpen(false);
      // Update local item state
      setItem((prevItem) => ({
        ...prevItem,
        status: "pending",
        claimedBy: user.id,
      }));
    } catch (err) {
      setError(err.message || "Failed to submit claim");
      setClaimDialogOpen(false);
    }
  };

  // Handle claim processing (approve/reject)
  const handleProcessClaim = async (approve) => {
    try {
      await processClaim(id, approve);
      setSuccess(
        approve ? "Claim approved successfully" : "Claim rejected successfully"
      );
      setProcessDialogOpen(false);
      // Update local item state
      setItem((prevItem) => ({
        ...prevItem,
        status: approve ? "claimed" : "available",
        claimedBy: approve ? prevItem.claimedBy : null,
      }));
    } catch (err) {
      setError(err.message || "Failed to process claim");
      setProcessDialogOpen(false);
    }
  };

  return (
    <Container maxWidth="md">
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={item.photoUrl || DEFAULT_IMAGE}
                alt={item.description}
                sx={{ objectFit: "cover" }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                {item.category}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <Chip
                  label={item.type === "lost" ? "Lost Item" : "Found Item"}
                  color={item.type === "lost" ? "error" : "info"}
                  size="small"
                />

                <Chip
                  label={
                    item.status.charAt(0).toUpperCase() + item.status.slice(1)
                  }
                  color={
                    item.status === "available"
                      ? "success"
                      : item.status === "claimed"
                      ? "secondary"
                      : "warning"
                  }
                  size="small"
                />
              </Box>

              <Typography variant="body1" paragraph>
                {item.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOn fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Location:</strong> {item.location}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(item.date)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Person fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Reported by:</strong> {item.reportedBy.firstName}{" "}
                  {item.reportedBy.lastName}
                </Typography>
              </Box>

              {item.contactInfo && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Contact:</strong> {item.contactInfo}
                  </Typography>
                </Box>
              )}
            </Box>

            {item.notes && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Additional Notes:
                </Typography>
                <Typography variant="body2" paragraph>
                  {item.notes}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {canClaim && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setClaimDialogOpen(true)}
                >
                  Claim This Item
                </Button>
              )}

              {canProcessClaim && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Check />}
                    onClick={() => {
                      setProcessAction(true);
                      setProcessDialogOpen(true);
                    }}
                  >
                    Approve Claim
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Close />}
                    onClick={() => {
                      setProcessAction(false);
                      setProcessDialogOpen(true);
                    }}
                  >
                    Reject Claim
                  </Button>
                </>
              )}

              {isOwner && (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/edit-item/${id}`)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Claim Dialog */}
      <Dialog open={claimDialogOpen} onClose={() => setClaimDialogOpen(false)}>
        <DialogTitle>Claim this item?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By submitting a claim, you are stating that this item belongs to
            you. Your claim will be reviewed by the person who reported the
            item.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClaimDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClaim} color="primary" variant="contained">
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete this item?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Are you sure you want to delete this
            item report?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Process Claim Dialog */}
      <Dialog
        open={processDialogOpen}
        onClose={() => setProcessDialogOpen(false)}
      >
        <DialogTitle>
          {processAction ? "Approve claim?" : "Reject claim?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {processAction
              ? "By approving this claim, you are confirming that this item has been returned to its rightful owner."
              : "By rejecting this claim, the item will be available for others to claim."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProcessDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleProcessClaim(processAction)}
            color={processAction ? "success" : "error"}
            variant="contained"
          >
            {processAction ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetails;
