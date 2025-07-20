
import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DispatchPrintManifest = React.forwardRef(({ dispatch, consignments }, ref) => {
  if (!dispatch || !consignments) {
    return <Typography>Loading print manifest...</Typography>;
  }

  return (
    <Box ref={ref} sx={{ p: 3, fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        Dispatch Manifest
      </Typography>

      <Typography variant="h6" gutterBottom>Dispatch Details</Typography>
      <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #ccc' }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Dispatch ID:</TableCell>
              <TableCell>{dispatch.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Truck Number:</TableCell>
              <TableCell>{dispatch.truck ? dispatch.truck.truck_number : 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Destination:</TableCell>
              <TableCell>{dispatch.destination_address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Dispatch Date:</TableCell>
              <TableCell>{new Date(dispatch.created_at).toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>Consignments</Typography>
      {consignments.length > 0 ? (
        <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Consignment No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Volume (m³)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Sender Name/Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Receiver Name/Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consignments.map((consignment) => (
                <TableRow key={consignment.id}>
                  <TableCell>{consignment.id}</TableCell>
                  <TableCell>{consignment.volume_cubic_meters}</TableCell>
                  <TableCell>{consignment.sender_address}</TableCell>
                  <TableCell>{`${consignment.receiver_name}, ${consignment.destination_address}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No consignments associated with this dispatch.</Typography>
      )}

      <Box sx={{ mt: 5, textAlign: 'right' }}>
        <Typography variant="body2">_________________________</Typography>
        <Typography variant="body2">Manager's Signature</Typography>
      </Box>
    </Box>
  );
});

export default DispatchPrintManifest;
