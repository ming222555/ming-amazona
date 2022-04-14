import React, { useState } from 'react';
import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import axios from 'axios';

import Layout from '../components/Layout';
import Link from '../components/Link';
import { LoginRes } from '../pages/api/users/login';

const PREFIX = 'LoginPage';

const StyledLoginForm = styled('form')({
  [`&.${PREFIX}-loginform`]: {
    maxWidth: 800,
    margin: 'auto',
  },
});

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const { data } = await axios.post<LoginRes>('/api/users/login', { email, password });
      // eslint-disable-next-line no-console
      console.log('login res', data);
      alert('success login');
    } catch (err) {
      alert(err.response.data ? err.response.data.errormsg : err.message);
    }
  };

  return (
    <Layout title="Login">
      <StyledLoginForm className={`${PREFIX}-loginform`} onSubmit={submitHandler}>
        <Typography variant="h1">Login</Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: 'email' }}
              onChange={(e): void => setEmail(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: 'password' }}
              onChange={(e): void => setPassword(e.target.value)}
            />
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
