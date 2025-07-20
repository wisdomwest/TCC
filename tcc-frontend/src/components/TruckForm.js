
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ApiService from '../services/ApiService';

const TruckForm = ({ onTruckCreated, onCancel }) => {
  const [truckNumber, setTruckNumber] = useState('');
  const [capacityCubicMeters, setCapacityCubicMeters] = useState('500.0');
  const [currentBranchId, setCurrentBranchId] = useState('');
  const [branches, setBranches] = useState([]);
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const data = {
        truck_number: truckNumber,
        capacity_cubic_meters: parseFloat(capacityCubicMeters),
        current_branch_id: currentBranchId || null, // Send null if empty
      };
      await ApiService.createTruck(data);
      setMessage('Truck created successfully!');
      // Clear form
      setTruckNumber('');
      setCapacityCubicMeters('500.0');
      setCurrentBranchId('');
      if (onTruckCreated) {
        onTruckCreated();
      }
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
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="truck_number"
        label="Truck Number"
        name="truck_number"
        autoFocus
        value={truckNumber}
        onChange={(e) => setTruckNumber(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        id="capacity_cubic_meters"
        label="Capacity (Cubic Meters)"
        name="capacity_cubic_meters"
        type="number"
        value={capacityCubicMeters}
        onChange={(e) => setCapacityCubicMeters(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="current-branch-label">Current Branch (Optional)</InputLabel>
        <Select
          labelId="current-branch-label"
          id="current_branch_id"
          value={currentBranchId}
          label="Current Branch (Optional)"
          onChange={(e) => setCurrentBranchId(e.target.value)}
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
        Add Truck
      </Button>
      {onCancel && (
        <Button
          fullWidth
          variant="outlined"
          onClick={onCancel}
          sx={{ mb: 2 }}
        >
          Cancel
        </Button>
      )}
      {message && (
        <Typography color="error" variant="body2">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default TruckForm;
