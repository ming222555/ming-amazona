import React, { useState, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import axios from 'axios';

import Layout from '../components/Layout';
import Link from '../components/Link';
import { LoginRes, IFTokenUser } from '../pages/api/users/login';
import StateContext from '../utils/StateContext';

const PREFIX = 'LoginPage';

const StyledLoginForm = styled('form')({
  [`&.${PREFIX}-loginform`]: {
    maxWidth: 800,
    margin: 'auto',
  },
});

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const { redirect } = router.query; // register?redirect=/shipping
  const { state, dispatch } = useContext(StateContext);
  const { userInfo } = state;

  const redirectTo: string = (redirect as string) ? (redirect as string) : '/';

  let isLogined = false;

  if (userInfo.token) {
    isLogined = true;
    router.push(redirectTo);
  }
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const { data } = await axios.post<LoginRes>('/api/users/register', { name, email, password });
      dispatch({ type: 'USER_LOGIN', payload: data as IFTokenUser });
    } catch (err) {
      alert(err.response.data ? err.response.data.errormsg : err.message);
    }
  };

  return (
    <Layout title="Register">
      <StyledLoginForm className={`${PREFIX}-loginform`} onSubmit={submitHandler}>
        <Typography variant="h1">Register</Typography>
        {isLogined ? (
          <Typography>Redirecting to {redirectTo === '/' ? 'home' : redirectTo.substring(1)} page...</Typography>
        ) : (
          <List>
            <ListItem>
              <TextField
                variant="outlined"
                fullWidth
                id="name"
                label="Name"
                inputProps={{ type: 'text' }}
                onChange={(e): void => setName(e.target.value)}
              />
            </ListItem>
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
              <TextField
                variant="outlined"
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                inputProps={{ type: 'password' }}
                onChange={(e): void => setConfirmPassword(e.target.value)}
              />
            </ListItem>
            <ListItem>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Register
              </Button>
            </ListItem>
            <ListItem>
              Already have an account?&nbsp;
              <Link href={`/login?redirect=${redirectTo}`}>Login</Link>
            </ListItem>
          </List>
        )}
      </StyledLoginForm>
    </Layout>
  );
};

export default RegisterPage;
