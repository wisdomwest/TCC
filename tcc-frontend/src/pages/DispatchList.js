
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';
import ApiService from '../services/ApiService';
import { Link } from 'react-router-dom';

const DispatchList = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDispatches = async () => {
    try {
      const response = await ApiService.getDispatches();
      setDispatches(response.data);
    } catch (err) {
      console.error("Error fetching dispatches:", err);
      setError("Failed to load dispatches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

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
          Dispatches
        </Typography>

        {dispatches.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {dispatches.map((dispatch) => (
              <Paper key={dispatch.id} sx={{ mb: 2, p: 2 }}>
                <ListItem
                  component={Link}
                  to={`/dispatches/${dispatch.id}`}
                  disablePadding
                >
                  <ListItemText
                    primary={`Dispatch ID: ${dispatch.id}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Destination: {dispatch.destination_address}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Truck ID: {dispatch.truck_id}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Dispatched At: {new Date(dispatch.created_at).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No dispatches found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default DispatchList;
