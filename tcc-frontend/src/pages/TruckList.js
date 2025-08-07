
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CircularProgress, Button, Chip, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';
import AuthService from '../auth/AuthService';
import { jwtDecode } from 'jwt-decode';
import TruckForm from '../components/TruckForm';
import TruckStatusUpdate from '../components/TruckStatusUpdate';

const TruckList = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const fetchTrucks = async () => {
    try {
      // Get current user details
      const currentUser = AuthService.getCurrentUser();
      const decodedToken = jwtDecode(currentUser.access_token);
      const userDetailsRes = await ApiService.getCurrentUserDetails();
      const userInfo = {
        ...userDetailsRes.data,
        role: decodedToken.role
      };
      setUserDetails(userInfo);
      
      const trucksRes = await ApiService.getTrucks();
      
      // Filter trucks by branch if user has a branch
      const filteredTrucks = userInfo.branch_id 
        ? trucksRes.data.filter(truck => truck.current_branch_id === userInfo.branch_id)
        : trucksRes.data;
        
      setTrucks(filteredTrucks);
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
  
  const handleStatusUpdate = (truck) => {
    setSelectedTruck(truck);
    setShowStatusUpdate(true);
  };
  
  const handleTruckUpdated = () => {
    setShowStatusUpdate(false);
    fetchTrucks(); // Refresh the list
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'IN_TRANSIT': return 'warning';
      case 'IDLE': return 'default';
      default: return 'default';
    }
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
          {userDetails?.branch_id ? 'Branch Trucks' : 'All Trucks'}
        </Typography>
        
        {userDetails?.role === 'MANAGER' && (
          <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
            Add New Truck
          </Button>
        )}

        {showForm && userDetails?.role === 'MANAGER' && (
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip 
                            label={truck.status} 
                            color={getStatusColor(truck.status)}
                            size="small"
                          />
                          {userDetails?.role === 'MANAGER' && (
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.preventDefault();
                                handleStatusUpdate(truck);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
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
        
        <TruckStatusUpdate
          truck={selectedTruck}
          open={showStatusUpdate}
          onClose={() => setShowStatusUpdate(false)}
          onUpdate={handleTruckUpdated}
        />
      </Box>
    </Container>
  );
};

export default TruckList;
