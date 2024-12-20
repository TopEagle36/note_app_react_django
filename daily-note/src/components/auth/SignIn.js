import React, { useContext } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import AppTheme from './theme/AppTheme';
import { server_uri } from '../../config/constant';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const navigate = useNavigate();

  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const { setToken, setRefreshToken, getAccessToken } = useContext(AuthContext);
  const token = getAccessToken();

  if(token){
    navigate('/notes')
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nameError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
   
    try {
      const response = await axios.post(server_uri + '/api/accounts/login/', {
        username: data.get('username'),
        password: data.get('password'),
      });
      setToken(response.data.access);
      setRefreshToken(response.data.refresh);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      navigate('/');
    } catch (error) {
      console.log("error", error.response?.data);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      if(error.response?.data?.detail==='No active account found with the given credentials'){
        setPasswordError(error.response.data.detail);
        setPasswordErrorMessage(error.response.data.detail);
        enqueueSnackbar(error.response.data.detail, {variant: 'error'});
      }
    }
  };

  const validateInputs = () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    let isValid = true;

    if (!username.value) {
      setNameError(true);
      setNameErrorMessage('Please enter a valid username address.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}>
            <FormControl>
              <FormLabel htmlFor="username">UserName</FormLabel>
              <TextField
                error={nameError}
                helperText={nameErrorMessage}
                id="username"
                type="string"
                name="username"
                placeholder="yourname"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl sx={{marginBottom: '22px'}}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}>
              Sign in
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
