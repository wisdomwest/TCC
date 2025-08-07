import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Typography,
  Alert
} from '@mui/material';
import ApiService from '../services/ApiService';

const TruckStatusUpdate = ({ truck, open, onClose, onUpdate }) => {
  const [status, setStatus] = useState(truck?.status || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!truck || !status) return;
    
    setLoading(true);
    setError('');
    
    try {
      await ApiService.updateTruck(truck.id, { status });
      onUpdate();
      onClose();
    } catch (err) {
      setError('Failed to update truck status');
      console.error('Error updating truck:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Truck Status</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Truck: {truck?.truck_number}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        }
        
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
            <MenuItem value="IDLE">Idle</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained" 
          disabled={loading || !status}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TruckStatusUpdate;