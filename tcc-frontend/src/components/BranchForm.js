
import React, { useState } from 'react';
import { TextField, Button, Box, FormControlLabel, Checkbox, Typography } from '@mui/material';
import ApiService from '../services/ApiService';

const BranchForm = ({ onBranchCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [isHq, setIsHq] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await ApiService.createBranch(name, isHq);
      setMessage('Branch created successfully!');
      setName('');
      setIsHq(false);
      if (onBranchCreated) {
        onBranchCreated();
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
        id="name"
        label="Branch Name"
        name="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isHq}
            onChange={(e) => setIsHq(e.target.checked)}
            name="isHq"
            color="primary"
          />
        }
        label="Is Headquarters"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Create Branch
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

export default BranchForm;
