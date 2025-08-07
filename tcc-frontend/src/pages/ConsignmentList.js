
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CircularProgress, Button, Chip, IconButton, TextField, MenuItem } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';
import AuthService from '../auth/AuthService';
import { jwtDecode } from 'jwt-decode';
import ConsignmentForm from '../components/ConsignmentForm';
import ConsignmentStatusUpdate from '../components/ConsignmentStatusUpdate';

const ConsignmentList = () => {
  const [consignments, setConsignments] = useState([]);
  const [filteredConsignments, setFilteredConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchConsignments = async () => {
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
      
      const consignmentsRes = await ApiService.getConsignments();
      
      // Filter consignments by branch if user has a branch
      const filtered = userInfo.branch_id 
        ? consignmentsRes.data.filter(consignment => consignment.origin_branch_id === userInfo.branch_id)
        : consignmentsRes.data;
        
      setConsignments(filtered);
      setFilteredConsignments(filtered);
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
  
  useEffect(() => {
    // Filter consignments based on status
    if (statusFilter === 'ALL') {
      setFilteredConsignments(consignments);
    } else {
      setFilteredConsignments(consignments.filter(c => c.status === statusFilter));
    }
  }, [statusFilter, consignments]);

  const handleConsignmentCreated = () => {
    setShowForm(false);
    fetchConsignments(); // Refresh the list
  };
  
  const handleStatusUpdate = (consignment) => {
    setSelectedConsignment(consignment);
    setShowStatusUpdate(true);
  };
  
  const handleConsignmentUpdated = () => {
    setShowStatusUpdate(false);
    fetchConsignments(); // Refresh the list
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'AWAITING_DISPATCH': return 'warning';
      case 'DISPATCHED': return 'info';
      case 'DELIVERED': return 'success';
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
          {userDetails?.branch_id ? 'Branch Consignments' : 'All Consignments'}
        </Typography>
        
        <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
          Create New Consignment
        </Button>
        
        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ mb: 2, minWidth: 200 }}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="AWAITING_DISPATCH">Awaiting Dispatch</MenuItem>
          <MenuItem value="DISPATCHED">Dispatched</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
        </TextField>

        {showForm && (
          <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>Create New Consignment</Typography>
            <ConsignmentForm onConsignmentCreated={handleConsignmentCreated} onCancel={() => setShowForm(false)} />
          </Paper>
        )}

        {filteredConsignments.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filteredConsignments.map((consignment) => (
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip 
                            label={consignment.status.replace('_', ' ')} 
                            color={getStatusColor(consignment.status)}
                            size="small"
                          />
                          {userDetails?.role === 'MANAGER' && (
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.preventDefault();
                                handleStatusUpdate(consignment);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
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
        
        <ConsignmentStatusUpdate
          consignment={selectedConsignment}
          open={showStatusUpdate}
          onClose={() => setShowStatusUpdate(false)}
          onUpdate={handleConsignmentUpdated}
        />
      </Box>
    </Container>
  );
};

export default ConsignmentList;
