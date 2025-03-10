import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    Grid,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";




const ReportItemForm = () => {
    const { register, handleSubmit, reset } = useForm();
    const [reportType, setReportType] = useState("lost");
    const navigate = useNavigate(); // Initialize useNavigate

    const handleToggle = (event, newType) => {
        if (newType !== null) {
            setReportType(newType);
            reset();
        }
    };

    const onSubmit = (data) => {
        console.log(`Reporting a ${reportType} item:`, data);
    };

    const handleCancel = () => {
        navigate("/"); // Navigate to the student dashboard (assuming '/' is the route)
    };

    return (
        <Paper
            elevation={3}
            style={{
                padding: "20px",
                maxWidth: "500px",
                margin: "auto",
            }}
        >
            <ToggleButtonGroup
                value={reportType}
                exclusive
                onChange={handleToggle}
                fullWidth
                style={{ marginBottom: "20px" }}
            >
                <ToggleButton value="lost" color="primary">
                    Report Lost Item
                </ToggleButton>
                <ToggleButton value="found" color="primary">
                    Report Found Item
                </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="h5" align="center" gutterBottom>
                {reportType === "lost"
                    ? "Report a Lost Item"
                    : "Report a Found Item"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Item Category</InputLabel>
                    <Select {...register("category")} required>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Books">Books</MenuItem>
                        <MenuItem value="Clothing">Clothing</MenuItem>
                        <MenuItem value="Accessories">Accessories</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Item Description"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                    required
                    {...register("description")}
                />

                <TextField
                    label={reportType === "lost" ? "Date Lost" : "Date Found"}
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                    {...register("date")}
                />

                <TextField
                    label="Location"
                    fullWidth
                    margin="normal"
                    required
                    {...register("location")}
                />

                <Typography variant="body2" style={{ margin: "10px 0" }}>
                    Upload Photo (Optional)
                </Typography>
                <input type="file" {...register("photo")} />

                <TextField
                    label="Contact Number (Optional)"
                    fullWidth
                    margin="normal"
                    {...register("contact")}
                />

                <TextField
                    label="Additional Notes (Optional)"
                    multiline
                    rows={2}
                    fullWidth
                    margin="normal"
                    {...register("notes")}
                />

                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    style={{ marginTop: "20px" }}
                >
                    <Grid item>
                        <Button variant="outlined" onClick={handleCancel}>
                            {" "}
                            {/* Add onClick */}
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default ReportItemForm;