
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      const response = await ApiService.getInvoices();
      setInvoices(response.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Invoices
        </Typography>

        {invoices.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {invoices.map((invoice) => (
              <Paper key={invoice.id} sx={{ mb: 2, p: 2 }}>
                <ListItem
                  button
                  component={Link}
                  to={`/invoices/${invoice.id}`}
                  disablePadding
                >
                  <ListItemText
                    primary={`Invoice ID: ${invoice.id}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Consignment ID: {invoice.consignment_id}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Amount: ${invoice.amount.toFixed(2)}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Created At: {new Date(invoice.created_at).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No invoices found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default InvoiceList;
