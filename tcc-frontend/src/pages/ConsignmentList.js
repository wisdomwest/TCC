
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';
import ConsignmentForm from '../components/ConsignmentForm';

const ConsignmentList = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchConsignments = async () => {
    try {
      const response = await ApiService.getConsignments();
      setConsignments(response.data);
    } catch (err) {
      console.error("Error fetching consignments:", err);
      setError("Failed to load consignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsignments();
  }, []);

  const handleConsignmentCreated = () => {
    setShowForm(false);
    fetchConsignments(); // Refresh the list
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
          Consignments
        </Typography>
        <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
          Create New Consignment
        </Button>

        {showForm && (
          <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>Create New Consignment</Typography>
            <ConsignmentForm onConsignmentCreated={handleConsignmentCreated} onCancel={() => setShowForm(false)} />
          </Paper>
        )}

        {consignments.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {consignments.map((consignment) => (
              <Paper key={consignment.id} sx={{ mb: 2, p: 2 }}>
                <ListItem
                  button
                  component={Link}
                  to={`/consignments/${consignment.id}`}
                  disablePadding
                >
                  <ListItemText
                    primary={`Consignment ID: ${consignment.id}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Volume: {consignment.volume_cubic_meters} m³
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Destination: {consignment.destination_address}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Status: {consignment.status}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No consignments found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default ConsignmentList;
