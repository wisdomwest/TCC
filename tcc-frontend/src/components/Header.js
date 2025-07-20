
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../auth/AuthService';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TCC Software
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/consignments')}>Consignments</Button>
          <Button color="inherit" onClick={() => navigate('/trucks')}>Trucks</Button>
          <Button color="inherit" onClick={() => navigate('/branches')}>Branches</Button>
          <Button color="inherit" onClick={() => navigate('/invoices')}>Invoices</Button>
          <Button color="inherit" onClick={() => navigate('/dispatches')}>Dispatches</Button>
          <Button color="inherit" onClick={() => navigate('/users')}>Users</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
