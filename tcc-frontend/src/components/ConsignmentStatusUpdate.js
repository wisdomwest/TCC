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

const ConsignmentStatusUpdate = ({ consignment, open, onClose, onUpdate }) => {
  const [status, setStatus] = useState(consignment?.status || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!consignment || !status) return;
    
    setLoading(true);
    setError('');
    
    try {
      await ApiService.updateConsignmentStatus(consignment.id, { status });
      onUpdate();
      onClose();
    } catch (err) {
      setError('Failed to update consignment status');
      console.error('Error updating consignment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Consignment Status</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Consignment: {consignment?.id}
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
            <MenuItem value="AWAITING_DISPATCH">Awaiting Dispatch</MenuItem>
            <MenuItem value="DISPATCHED">Dispatched</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
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

export default ConsignmentStatusUpdate;