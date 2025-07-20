
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Grid } from '@mui/material';
import ApiService from '../services/ApiService';

const BranchDetails = () => {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const branchRes = await ApiService.getBranch(branchId);
        setBranch(branchRes.data);
      } catch (err) {
        console.error("Error fetching branch details:", err);
        setError("Failed to load branch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranchDetails();
  }, [branchId]);

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

  if (!branch) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography>Branch not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Branch Details: {branch.name}
        </Typography>

        <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Branch ID:</Typography>
              <Typography>{branch.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Is Headquarters:</Typography>
              <Typography>{branch.is_hq ? 'Yes' : 'No'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Created At:</Typography>
              <Typography>{new Date(branch.created_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default BranchDetails;
