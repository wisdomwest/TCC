
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
          Users
        </Typography>

        {users.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {users.map((user) => (
              <Paper key={user.id} sx={{ mb: 2, p: 2 }}>
                <ListItem
                  button
                  component={Link}
                  to={`/users/${user.id}`}
                  disablePadding
                >
                  <ListItemText
                    primary={`Username: ${user.username}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Role: {user.role}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Branch ID: {user.branch_id || 'N/A'}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No users found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default UserList;
