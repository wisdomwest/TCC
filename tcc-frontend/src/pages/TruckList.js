
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';
import TruckForm from '../components/TruckForm';

const TruckList = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTrucks = async () => {
    try {
      const response = await ApiService.getTrucks();
      setTrucks(response.data);
    } catch (err) {
      console.error("Error fetching trucks:", err);
      setError("Failed to load trucks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleTruckCreated = () => {
    setShowForm(false);
    fetchTrucks(); // Refresh the list
  };

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

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Trucks
        </Typography>
        <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
          Add New Truck
        </Button>

        {showForm && (
          <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>Add New Truck</Typography>
            <TruckForm onTruckCreated={handleTruckCreated} onCancel={() => setShowForm(false)} />
          </Paper>
        )}

        {trucks.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {trucks.map((truck) => (
              <Paper key={truck.id} sx={{ mb: 2, p: 2 }}>
                <ListItem
                  button
                  component={Link}
                  to={`/trucks/${truck.id}`}
                  disablePadding
                >
                  <ListItemText
                    primary={`Truck Number: ${truck.truck_number}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Capacity: {truck.capacity_cubic_meters} m³
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Status: {truck.status}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Current Branch: {truck.current_branch_id || 'N/A'}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No trucks found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default TruckList;
