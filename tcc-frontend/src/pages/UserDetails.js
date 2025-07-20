
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Grid } from '@mui/material';
import ApiService from '../services/ApiService';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userRes = await ApiService.getUser(userId);
        setUser(userRes.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

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

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography>User not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          User Details: {user.username}
        </Typography>

        <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">User ID:</Typography>
              <Typography>{user.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Role:</Typography>
              <Typography>{user.role}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Branch ID:</Typography>
              <Typography>{user.branch_id || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Created At:</Typography>
              <Typography>{new Date(user.created_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserDetails;
