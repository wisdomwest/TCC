import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import ApiService from '../services/ApiService';
import AuthService from '../auth/AuthService';
import { jwtDecode } from 'jwt-decode';
import QuickActions from '../components/QuickActions';
import BranchStats from '../components/BranchStats';
import TruckStatusUpdate from '../components/TruckStatusUpdate';
import ConsignmentForm from '../components/ConsignmentForm';

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
  const [userDetails, setUserDetails] = useState(null);
  const [showBranchStats, setShowBranchStats] = useState(false);
  const [showTruckUpdate, setShowTruckUpdate] = useState(false);
  const [showConsignmentForm, setShowConsignmentForm] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [branchTrucks, setBranchTrucks] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get current user details
        const currentUser = AuthService.getCurrentUser();
        const decodedToken = jwtDecode(currentUser.access_token);
        const userDetailsRes = await ApiService.getCurrentUserDetails();
        setUserDetails({
          ...userDetailsRes.data,
          role: decodedToken.role
        });

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
        
        // If user is manager/staff, filter trucks by their branch
        const trucksRes = await ApiService.getTrucks();
        const filteredTrucks = userDetailsRes.data.branch_id 
          ? trucksRes.data.filter(truck => truck.current_branch_id === userDetailsRes.data.branch_id)
          : trucksRes.data;
        setBranchTrucks(filteredTrucks);

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
  
  const handleQuickAction = (action) => {
    switch (action) {
      case 'mark-arrived':
        if (branchTrucks.length > 0) {
          setSelectedTruck(branchTrucks.find(truck => truck.status === 'IN_TRANSIT') || branchTrucks[0]);
          setShowTruckUpdate(true);
        }
        break;
      case 'create-consignment':
        setShowConsignmentForm(true);
        break;
      case 'branch-stats':
        setShowBranchStats(true);
        break;
      case 'pending-dispatches':
        // Navigate to consignments with filter
        window.location.href = '/consignments?status=AWAITING_DISPATCH';
        break;
      default:
        break;
    }
  };
  
  const handleTruckUpdate = () => {
    setShowTruckUpdate(false);
    // Refresh data
    window.location.reload();
  };
  
  const handleConsignmentCreated = () => {
    setShowConsignmentForm(false);
    // Refresh data
    window.location.reload();
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
          {userDetails?.branch_id ? `${userDetails.role} Dashboard` : 'TCC Dashboard'}
        </Typography>
        
        {userDetails && (
          <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
            Welcome, {userDetails.username}! 
            {userDetails.branch_id && ` You are managing operations for your branch.`}
          </Alert>
        )}
        
        {userDetails && (
          <QuickActions 
            userRole={userDetails.role} 
            branchId={userDetails.branch_id}
            onAction={handleQuickAction}
          />
        )}

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
          <Typography variant="h5" gutterBottom>
            {userDetails?.branch_id ? 'Branch Trucks (Last 7 Days)' : 'Truck Usage (Last 7 Days)'}
          </Typography>
          <Paper sx={{ p: 2 }}>
            {(userDetails?.branch_id ? branchTrucks : stats.truckUsage).length > 0 ? (
              <Grid container spacing={2}>
                {(userDetails?.branch_id ? branchTrucks : stats.truckUsage).map((truck) => (
                  <Grid item xs={12} sm={6} md={4} key={truck.truck_id || truck.id}>
                    <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: '4px' }}>
                      <Typography variant="subtitle1">
                        Truck: {truck.truck_number}
                      </Typography>
                      <Typography variant="body2">
                        {truck.dispatch_count !== undefined 
                          ? `Dispatches: ${truck.dispatch_count}`
                          : `Status: ${truck.status}`
                        }
                      </Typography>
                      {userDetails?.role === 'MANAGER' && (
                        <Typography variant="caption" color="text.secondary">
                          Capacity: {truck.capacity_cubic_meters}m³
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No truck data available.</Typography>
            )}
          </Paper>
        </Box>
        
        {/* Dialogs */}
        {userDetails && (
          <>
            <BranchStats 
              branchId={userDetails.branch_id}
              open={showBranchStats}
              onClose={() => setShowBranchStats(false)}
            />
            
            <TruckStatusUpdate
              truck={selectedTruck}
              open={showTruckUpdate}
              onClose={() => setShowTruckUpdate(false)}
              onUpdate={handleTruckUpdate}
            />
            
            {showConsignmentForm && (
              <Paper sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                          width: '90%', maxWidth: '500px', p: 3, zIndex: 1300 }}>
                <Typography variant="h6" gutterBottom>Create New Consignment</Typography>
                <ConsignmentForm 
                  onConsignmentCreated={handleConsignmentCreated} 
                  onCancel={() => setShowConsignmentForm(false)} 
                />
              </Paper>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;