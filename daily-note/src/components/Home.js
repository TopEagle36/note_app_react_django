import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

export default function Home() {
  const { getAccessToken } = useContext(AuthContext);
  const token = getAccessToken();
  const navigate = useNavigate();

  const handleRedirect = () => {
      if (token) {
          navigate('/notes'); // Redirect to dashboard if token exists
      } else {
          navigate('/signin'); // Redirect to signin page if token doesn't exist
      }
  };

  return (
      <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height="87vh"
          textAlign="center"
          sx={{ bgcolor: 'background.paper', p: 3 }}
      >
          <Typography variant="h3" gutterBottom>
              Welcome to Home Page
          </Typography>
          <Typography variant="body1" gutterBottom>
              {token ? 'You are logged in.' : 'Please log in to continue.'}
          </Typography>
          <Button
              variant="contained"
              color="primary"
              onClick={handleRedirect}
              sx={{ mt: 2 }}
          >
              {token ? 'Go to Dashboard' : 'Go to Sign In'}
          </Button>
      </Box>
  );
}
