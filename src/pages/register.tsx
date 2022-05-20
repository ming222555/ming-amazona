import React, { useState, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import Link from '../components/shared/Link';
import { IFTokenUser } from '../pages/api/users/login';
import StateContext from '../utils/StateContext';
import { getError } from '../utils/error/frontend/error';

const PREFIX = 'LoginPage';

const StyledLoginForm = styled('form')({
  [`&.${PREFIX}-loginform`]: {
    maxWidth: 800,
    margin: 'auto',
  },
});

interface IFFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: NextPage = () => {
  // https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFFormData>();

  const router = useRouter();
  const { redirect } = router.query; // register?redirect=/shipping
  const { state, dispatch } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [loading, setLoading] = useState(false);

  const redirectTo: string = (redirect as string) ? (redirect as string) : '/';

  let isLogined = false;

  if (userInfo.token) {
    isLogined = true;
    router.push(redirectTo);
  }

  const submitHandler = async ({ name, email, password, confirmPassword }: IFFormData): Promise<void> => {
    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords don't match",
        backgroundColor: '#FF3232',
      });
      return;
    }
    const nameTrim = name.trim();
    const emailTrim = email.trim();

    if (!nameTrim) {
      setAlert({
        open: true,
        message: 'Name cannot be blank',
        backgroundColor: '#FF3232',
      });
      return;
    }
    if (!emailTrim) {
      setAlert({
        open: true,
        message: 'Email cannot be blank',
        backgroundColor: '#FF3232',
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post<IFTokenUser>('/api/users/register', {
        name: nameTrim,
        email: emailTrim,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
    } catch (err: unknown) {
      setLoading(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  return (
    <Layout title="Register">
      <StyledLoginForm className={`${PREFIX}-loginform`} onSubmit={handleSubmit(submitHandler)}>
        <Typography variant="h1">Register</Typography>
        {isLogined ? (
          <Typography>Redirecting to {redirectTo === '/' ? 'home' : redirectTo.substring(1)} page...</Typography>
        ) : (
          <>
            <fieldset style={{ margin: 0, padding: 0, border: 'transparent' }} disabled={loading}>
              <List>
                <ListItem>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: true, minLength: 6 }}
                    render={({ field }): JSX.Element => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="name"
                        label="Name"
                        error={Boolean(errors.name)}
                        helperText={
                          errors.name
                            ? errors.name.type === 'minLength'
                              ? 'Name length is more than 5'
                              : 'Name is required'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ }}
                    render={({ field }): JSX.Element => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="email"
                        label="Email"
                        inputProps={{ type: 'email' }}
                        error={Boolean(errors.email)}
                        helperText={
                          errors.email
                            ? errors.email.type === 'pattern'
                              ? 'Email is not valid'
                              : 'Email is required'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: true, minLength: 6 }}
                    render={({ field }): JSX.Element => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="password"
                        label="Password"
                        inputProps={{ type: 'password' }}
                        error={Boolean(errors.password)}
                        helperText={
                          errors.password
                            ? errors.password.type === 'minLength'
                              ? 'Password length is more than 5'
                              : 'Password is required'
                            : ''
                        }
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }): JSX.Element => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        inputProps={{ type: 'password' }}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword ? 'Confirm Password is required' : ''}
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Button variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
                    {loading ? <CircularProgress size={30} /> : 'Register'}
                  </Button>
                </ListItem>
                <ListItem>
                  Already have an account?&nbsp;
                  <Link href={`/login?redirect=${redirectTo}`}>Login</Link>
                </ListItem>
              </List>
            </fieldset>
            <Snackbar
              open={alert.open}
              message={alert.message}
              ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              onClose={(): void => setAlert({ ...alert, open: false })}
              autoHideDuration={4000}
            />
          </>
        )}
      </StyledLoginForm>
    </Layout>
  );
};

export default RegisterPage;
