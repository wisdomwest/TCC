
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ApiService from '../services/ApiService';

const ConsignmentForm = ({ onConsignmentCreated, onCancel }) => {
  const [volumeCubicMeters, setVolumeCubicMeters] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [originBranchId, setOriginBranchId] = useState('');
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
        volume_cubic_meters: parseFloat(volumeCubicMeters),
        destination_address: destinationAddress,
        sender_address: senderAddress,
        receiver_name: receiverName,
        origin_branch_id: originBranchId,
      };
      await ApiService.createConsignment(data);
      setMessage('Consignment created successfully!');
      // Clear form
      setVolumeCubicMeters('');
      setDestinationAddress('');
      setSenderAddress('');
      setReceiverName('');
      setOriginBranchId('');
      if (onConsignmentCreated) {
        onConsignmentCreated();
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
        id="volume_cubic_meters"
        label="Volume (Cubic Meters)"
        name="volume_cubic_meters"
        type="number"
        value={volumeCubicMeters}
        onChange={(e) => setVolumeCubicMeters(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="destination_address"
        label="Destination Address"
        name="destination_address"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="sender_address"
        label="Sender Address"
        name="sender_address"
        value={senderAddress}
        onChange={(e) => setSenderAddress(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="receiver_name"
        label="Receiver Name"
        name="receiver_name"
        value={receiverName}
        onChange={(e) => setReceiverName(e.target.value)}
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="origin-branch-label">Origin Branch</InputLabel>
        <Select
          labelId="origin-branch-label"
          id="origin_branch_id"
          value={originBranchId}
          label="Origin Branch"
          onChange={(e) => setOriginBranchId(e.target.value)}
        >
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
        Create Consignment
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

export default ConsignmentForm;
