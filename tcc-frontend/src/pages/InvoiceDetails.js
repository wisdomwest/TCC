
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Grid } from '@mui/material';
import ApiService from '../services/ApiService';

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [consignment, setConsignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const invoiceRes = await ApiService.getInvoice(invoiceId);
        setInvoice(invoiceRes.data);

        if (invoiceRes.data.consignment_id) {
          const consignmentRes = await ApiService.getConsignment(invoiceRes.data.consignment_id);
          setConsignment(consignmentRes.data);
        }

      } catch (err) {
        console.error("Error fetching invoice details:", err);
        setError("Failed to load invoice details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

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

  if (!invoice) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography>Invoice not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Invoice Details: {invoice.id}
        </Typography>

        <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
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
              <Typography variant="h6">Consignment ID:</Typography>
              <Typography>{invoice.consignment_id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Created At:</Typography>
              <Typography>{new Date(invoice.created_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {consignment && (
          <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
            <Typography component="h2" variant="h5" gutterBottom>
              Associated Consignment
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Consignment ID:</Typography>
                <Typography>{consignment.id}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Volume:</Typography>
                <Typography>{consignment.volume_cubic_meters} m³</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Destination:</Typography>
                <Typography>{consignment.destination_address}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Sender:</Typography>
                <Typography>{consignment.sender_address}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Receiver:</Typography>
                <Typography>{consignment.receiver_name}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default InvoiceDetails;
