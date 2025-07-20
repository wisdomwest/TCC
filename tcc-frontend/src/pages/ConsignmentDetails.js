
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Grid } from '@mui/material';
import ApiService from '../services/ApiService';

const ConsignmentDetails = () => {
  const { consignmentId } = useParams();
  const [consignment, setConsignment] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsignmentDetails = async () => {
      try {
        const consignmentRes = await ApiService.getConsignment(consignmentId);
        setConsignment(consignmentRes.data);

        if (consignmentRes.data.invoice_id) {
          const invoiceRes = await ApiService.getInvoice(consignmentRes.data.invoice_id);
          setInvoice(invoiceRes.data);
        }

      } catch (err) {
        console.error("Error fetching consignment details:", err);
        setError("Failed to load consignment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsignmentDetails();
  }, [consignmentId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!consignment) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography>Consignment not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Consignment Details: {consignment.id}
        </Typography>

        <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Volume:</Typography>
              <Typography>{consignment.volume_cubic_meters} m³</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Destination:</Typography>
              <Typography>{consignment.destination_address}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Sender Address:</Typography>
              <Typography>{consignment.sender_address}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Receiver Name:</Typography>
              <Typography>{consignment.receiver_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Origin Branch ID:</Typography>
              <Typography>{consignment.origin_branch_id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Status:</Typography>
              <Typography>{consignment.status}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Created At:</Typography>
              <Typography>{new Date(consignment.created_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {invoice && (
          <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
            <Typography component="h2" variant="h5" gutterBottom>
              Associated Invoice
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Invoice ID:</Typography>
                <Typography>{invoice.id}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Amount:</Typography>
                <Typography>${invoice.amount.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Created At:</Typography>
                <Typography>{new Date(invoice.created_at).toLocaleString()}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default ConsignmentDetails;
