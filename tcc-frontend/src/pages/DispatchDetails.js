
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import ApiService from '../services/ApiService';
import { useReactToPrint } from 'react-to-print';
import DispatchPrintManifest from '../components/DispatchPrintManifest';

const DispatchDetails = () => {
  const { dispatchId } = useParams();
  const [dispatch, setDispatch] = useState(null);
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchDispatchDetails = async () => {
      try {
        const dispatchRes = await ApiService.getDispatch(dispatchId);
        setDispatch(dispatchRes.data);

        // Assuming consignments associated with a dispatch can be filtered by dispatch_id
        // This might require a new backend endpoint or filtering on the frontend
        const allConsignmentsRes = await ApiService.getConsignments();
        const associatedConsignments = allConsignmentsRes.data.filter(
          (c) => c.dispatch_id === dispatchId
        );
        setConsignments(associatedConsignments);

      } catch (err) {
        console.error("Error fetching dispatch details:", err);
        setError("Failed to load dispatch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDispatchDetails();
  }, [dispatchId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Dispatch_Manifest_${dispatchId}`,
  });

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

  if (!dispatch) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography>Dispatch not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Dispatch Details
        </Typography>

        <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Dispatch ID:</Typography>
              <Typography>{dispatch.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Destination:</Typography>
              <Typography>{dispatch.destination_address}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Truck ID:</Typography>
              <Typography>{dispatch.truck_id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Dispatched At:</Typography>
              <Typography>{new Date(dispatch.created_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{ mt: 3 }}
          >
            Print Dispatch Manifest
          </Button>
        </Paper>

        <Typography component="h2" variant="h5" gutterBottom sx={{ mt: 4 }}>
          Associated Consignments
        </Typography>
        {consignments.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {consignments.map((consignment) => (
              <Paper key={consignment.id} sx={{ mb: 2, p: 2 }}>
                <ListItem disablePadding>
                  <ListItemText
                    primary={`Consignment ID: ${consignment.id}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Volume: {consignment.volume_cubic_meters} m³
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Sender: {consignment.sender_address}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Receiver: {consignment.receiver_name} ({consignment.destination_address})
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No consignments found for this dispatch.</Typography>
        )}

        {/* Hidden component for printing */}
        <Box sx={{ display: 'none' }}>
          <DispatchPrintManifest dispatch={dispatch} consignments={consignments} ref={componentRef} />
        </Box>
      </Box>
    </Container>
  );
};

export default DispatchDetails;
