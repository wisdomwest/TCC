import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';
import ApiService from '../services/ApiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalConsignments: 0,
    totalRevenue: 0,
    averageWaitTime: 'N/A',
    averageIdleTime: 'N/A',
    truckUsage: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total consignments and revenue
        const consignmentsRes = await ApiService.getConsignments();
        const allConsignments = consignmentsRes.data;
        const totalConsignments = allConsignments.length;

        // For total revenue, we need to fetch invoices or calculate from consignments if they include invoice data
        // Assuming consignments don't directly include invoice amount, we'll fetch invoices separately.
        const invoicesRes = await ApiService.getInvoices();
        const totalRevenue = invoicesRes.data.reduce((sum, invoice) => sum + invoice.amount, 0);

        // Fetch average wait time for consignments
        const avgWaitTimeRes = await ApiService.getAverageWaitTime();
        const averageWaitTime = avgWaitTimeRes.data.average_wait_time_seconds ?
          `${(avgWaitTimeRes.data.average_wait_time_seconds / 3600).toFixed(2)} hours` : 'N/A';

        // Fetch average idle time for trucks
        const avgIdleTimeRes = await ApiService.getAverageIdleTime();
        const averageIdleTime = avgIdleTimeRes.data.average_idle_time_seconds ?
          `${(avgIdleTimeRes.data.average_idle_time_seconds / 3600).toFixed(2)} hours` : 'N/A';

        // Fetch truck usage
        const truckUsageRes = await ApiService.getTruckUsage();
        const truckUsage = truckUsageRes.data;

        setStats({
          totalConsignments,
          totalRevenue,
          averageWaitTime,
          averageIdleTime,
          truckUsage,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
          TCC Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Consignments</Typography>
              <Typography variant="h4" color="primary">{stats.totalConsignments}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4" color="primary">${stats.totalRevenue.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Avg. Consignment Wait Time</Typography>
              <Typography variant="h4" color="primary">{stats.averageWaitTime}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Avg. Truck Idle Time</Typography>
              <Typography variant="h4" color="primary">{stats.averageIdleTime}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, width: '100%' }}>
          <Typography variant="h5" gutterBottom>Truck Usage (Last 7 Days)</Typography>
          <Paper sx={{ p: 2 }}>
            {stats.truckUsage.length > 0 ? (
              <Grid container spacing={2}>
                {stats.truckUsage.map((truck) => (
                  <Grid item xs={12} sm={6} md={4} key={truck.truck_id}>
                    <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: '4px' }}>
                      <Typography variant="subtitle1">Truck: {truck.truck_number}</Typography>
                      <Typography variant="body2">Dispatches: {truck.dispatch_count}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No truck usage data available.</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;