
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';
import BranchForm from '../components/BranchForm';

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBranches = async () => {
    try {
      const response = await ApiService.getBranches();
      setBranches(response.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
      setError("Failed to load branches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleBranchCreated = () => {
    setShowForm(false);
    fetchBranches(); // Refresh the list
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
          Branches
        </Typography>
        <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
          Add New Branch
        </Button>

        {showForm && (
          <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>Create New Branch</Typography>
            <BranchForm onBranchCreated={handleBranchCreated} onCancel={() => setShowForm(false)} />
          </Paper>
        )}

        {branches.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {branches.map((branch) => (
              <Paper key={branch.id} sx={{ mb: 2, p: 2 }}>
                <ListItem
                  button
                  component={Link}
                  to={`/branches/${branch.id}`}
                  disablePadding
                >
                  <ListItemText
                    primary={branch.name}
                    secondary={branch.is_hq ? 'Headquarters' : 'Branch Office'}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No branches found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default BranchList;
