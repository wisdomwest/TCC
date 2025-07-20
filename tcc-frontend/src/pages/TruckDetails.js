
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Grid, List, ListItem, ListItemText } from '@mui/material';
import ApiService from '../services/ApiService';

const TruckDetails = () => {
  const { truckId } = useParams();
  const [truck, setTruck] = useState(null);
  const [truckUsage, setTruckUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTruckDetails = async () => {
      try {
        const truckRes = await ApiService.getTruck(truckId);
        setTruck(truckRes.data);

        // Fetch truck usage for this specific truck (assuming API supports it or filter on frontend)
        // For now, get all truck usage and filter by truckId
        const allTruckUsageRes = await ApiService.getTruckUsage();
        const specificTruckUsage = allTruckUsageRes.data.filter(usage => usage.truck_id === truckId);
        setTruckUsage(specificTruckUsage);

      } catch (err) {
        console.error("Error fetching truck details:", err);
        setError("Failed to load truck details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTruckDetails();
  }, [truckId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!truck) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography>Truck not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Truck Details: {truck.truck_number}
        </Typography>

        <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Truck ID:</Typography>
              <Typography>{truck.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Capacity:</Typography>
              <Typography>{truck.capacity_cubic_meters} m³</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Status:</Typography>
              <Typography>{truck.status}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Current Branch:</Typography>
              <Typography>{truck.current_branch_id || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography component="h2" variant="h5" gutterBottom sx={{ mt: 4 }}>
          Usage Statistics
        </Typography>
        {truckUsage.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {truckUsage.map((usage) => (
              <Paper key={usage.truck_id} sx={{ mb: 2, p: 2 }}>
                <ListItem disablePadding>
                  <ListItemText
                    primary={`Dispatches in last 7 days: ${usage.dispatch_count}`}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No usage data available for this truck.</Typography>
        )}

        {/* TODO: Add dispatch history if available via API */}
      </Box>
    </Container>
  );
};

export default TruckDetails;
