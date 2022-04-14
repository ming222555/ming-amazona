import React from 'react';
import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Layout from '../components/Layout';
import Link from '../components/Link';

const PREFIX = 'LoginPage';

const StyledLoginForm = styled('form')({
  [`&.${PREFIX}-loginform`]: {
    maxWidth: 800,
    margin: 'auto',
  },
});

const LoginPage: NextPage = () => {
  return (
    <Layout title="Login">
      <StyledLoginForm className={`${PREFIX}-loginform`}>
        <Typography variant="h1">Login</Typography>
        <List>
          <ListItem>
            <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{ type: 'email' }} />
          </ListItem>
          <ListItem>
            <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{ type: 'password' }} />
          </ListItem>
          <ListItem>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don&lsquo;t have an account?&nbsp;<Link href="/register">Register</Link>
          </ListItem>
        </List>
      </StyledLoginForm>
    </Layout>
  );
};

export default LoginPage;
