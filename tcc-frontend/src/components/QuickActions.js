import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  Box,
  Chip
} from '@mui/material';
import { 
  LocalShipping, 
  Assignment, 
  CheckCircle, 
  Schedule,
  TrendingUp
} from '@mui/icons-material';

const QuickActions = ({ userRole, branchId, onAction }) => {
  const quickActions = [
    {
      title: 'Mark Truck Arrived',
      description: 'Update truck status to available',
      icon: <CheckCircle color="success" />,
      action: 'mark-arrived',
      roles: ['MANAGER', 'STAFF']
    },
    {
      title: 'Create Consignment',
      description: 'Add new shipment',
      icon: <Assignment color="primary" />,
      action: 'create-consignment',
      roles: ['MANAGER', 'STAFF']
    },
    {
      title: 'View Branch Stats',
      description: 'Branch performance metrics',
      icon: <TrendingUp color="info" />,
      action: 'branch-stats',
      roles: ['MANAGER']
    },
    {
      title: 'Pending Dispatches',
      description: 'View awaiting consignments',
      icon: <Schedule color="warning" />,
      action: 'pending-dispatches',
      roles: ['MANAGER', 'STAFF']
    }
  ];

  const availableActions = quickActions.filter(action => 
    action.roles.includes(userRole)
  );

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
          <Chip 
            label={userRole} 
            size="small" 
            color="primary" 
            sx={{ ml: 2 }} 
          />
        </Typography>
        <Grid container spacing={2}>
          {availableActions.map((action) => (
            <Grid item xs={12} sm={6} md={3} key={action.action}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={action.icon}
                onClick={() => onAction(action.action)}
                sx={{ 
                  height: '80px', 
                  flexDirection: 'column',
                  textTransform: 'none'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {action.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;