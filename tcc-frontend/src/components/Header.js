
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../auth/AuthService';
import ApiService from '../services/ApiService';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          const decodedToken = jwtDecode(currentUser.access_token);
          const userDetailsRes = await ApiService.getCurrentUserDetails();
          setUserDetails({
            ...userDetailsRes.data,
            role: decodedToken.role
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    
    fetchUserDetails();
  }, []);

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
          {userDetails && (
            <Chip 
              label={`${userDetails.role} - ${userDetails.username}`}
              size="small"
              sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          )}
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/consignments')}>Consignments</Button>
          <Button color="inherit" onClick={() => navigate('/trucks')}>Trucks</Button>
          <Button color="inherit" onClick={() => navigate('/branches')}>Branches</Button>
          <Button color="inherit" onClick={() => navigate('/invoices')}>Invoices</Button>
          <Button color="inherit" onClick={() => navigate('/dispatches')}>Dispatches</Button>
          {userDetails?.role === 'MANAGER' && (
            <Button color="inherit" onClick={() => navigate('/users')}>Users</Button>
          )}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
