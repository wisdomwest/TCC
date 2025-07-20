import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AuthService from '../auth/AuthService';
import ApiService from '../services/ApiService'; // Import ApiService
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STAFF'); // Default role
  const [branchId, setBranchId] = useState(''); // Initialize as empty string
  const [branches, setBranches] = useState([]); // State to store branches
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await ApiService.getBranches();
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
        setMessage("Failed to load branches for selection.");
      }
    };
    fetchBranches();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Send null if branchId is empty string (no branch selected)
      await AuthService.register(username, password, role, branchId || null);
      setMessage('Registration successful!');
      navigate('/login');
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value={"STAFF"}>Staff</MenuItem>
              <MenuItem value={"MANAGER"}>Manager</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="branch-label">Branch (Optional)</InputLabel>
            <Select
              labelId="branch-label"
              id="branchId"
              value={branchId}
              label="Branch (Optional)"
              onChange={(e) => setBranchId(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          {message && (
            <Typography color="error" variant="body2">
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Register;