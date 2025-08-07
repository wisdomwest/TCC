import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import ApiService from '../services/ApiService';

const BranchStats = ({ branchId, open, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && branchId) {
      fetchBranchStats();
    }
  }, [open, branchId]);

  const fetchBranchStats = async () => {
    setLoading(true);
    try {
      const [trucksRes, consignmentsRes] = await Promise.all([
        ApiService.getTrucks(),
        ApiService.getConsignments()
      ]);

      const branchTrucks = trucksRes.data.filter(truck => 
        truck.current_branch_id === branchId
      );
      
      const branchConsignments = consignmentsRes.data.filter(consignment => 
        consignment.origin_branch_id === branchId
      );

      const availableTrucks = branchTrucks.filter(truck => 
        truck.status === 'AVAILABLE'
      ).length;

      const pendingConsignments = branchConsignments.filter(consignment => 
        consignment.status === 'AWAITING_DISPATCH'
      ).length;

      setStats({
        totalTrucks: branchTrucks.length,
        availableTrucks,
        totalConsignments: branchConsignments.length,
        pendingConsignments
      });
    } catch (error) {
      console.error('Error fetching branch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Branch Statistics</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : stats ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Trucks
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalTrucks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Available Trucks
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {stats.availableTrucks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Consignments
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalConsignments}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Dispatches
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {stats.pendingConsignments}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography>No data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BranchStats;