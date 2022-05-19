import React, { useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import { IFTokenUser } from '../pages/api/users/login';
import { IFProfile } from '../db/rdbms_tbl_cols';
import StateContext from '../utils/StateContext';
import { getError } from '../utils/error/frontend/error';

const PREFIX = 'ProfilePage';

const StyledForm = styled('form')({
  [`&.${PREFIX}-form`]: {
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

const ProfilePage: NextPage = () => {
  // https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFFormData>();

  const { state, dispatch } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<IFProfile | null>(null);
  const router = useRouter();

  const submitHandler = async ({ name, email, password, confirmPassword }: IFFormData): Promise<void> => {
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setAlert({
          open: true,
          message: "Passwords don't match",
          backgroundColor: '#FF3232',
        });
        return;
      }
    }
    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.put<IFTokenUser>(
        `/api/users/profile`,
        { ...profile, name: name.trim(), email: email.trim(), password },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );
      setLoading(false);
      setAlert({
        open: true,
        message: 'Profile updated successfully',
        backgroundColor: '#4BB543',
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

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      router.push('/login?redirect=/profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (userInfo.token) {
      const fetchprofile = async (): Promise<void> => {
        try {
          const { data } = await axios.get<IFProfile>('/api/users/profile', {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setValue('name', data.name);
          setValue('email', ''); // for fixing bug... to reveal bug, edit email with preceding spaces. Click UPDATE
          setValue('email', data.email);
          setProfile(data);
        } catch (err: unknown) {
          setAlert({
            open: true,
            message: getError(err),
            backgroundColor: '#FF3232',
          });
        }
      };
      fetchprofile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.token]);

  return (
    <Layout title="Profile">
      <Typography variant="h1">Profile</Typography>
      {profile ? (
        <>
          <StyledForm className={`${PREFIX}-form`} onSubmit={handleSubmit(submitHandler)}>
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
                    rules={{ /* required: true, */ minLength: 6 }}
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
                    // rules={{ required: true }}
                    render={({ field }): JSX.Element => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        inputProps={{ type: 'password' }}
                        // error={Boolean(errors.confirmPassword)}
                        // helperText={errors.confirmPassword ? 'Confirm Password is required' : ''}
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Button variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
                    {loading ? <CircularProgress size={30} /> : 'Update'}
                  </Button>
                </ListItem>
              </List>
            </fieldset>
          </StyledForm>
          <Snackbar
            open={alert.open}
            message={alert.message}
            ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={(): void => setAlert({ ...alert, open: false })}
            autoHideDuration={4000}
          />
        </>
      ) : alert.message ? (
        <Snackbar
          open={alert.open}
          message={alert.message}
          ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={(): void => setAlert({ ...alert, open: false })}
          autoHideDuration={4000}
        />
      ) : (
        <StyledForm className={`${PREFIX}-form`} onSubmit={handleSubmit(submitHandler)}>
          <fieldset style={{ margin: 0, padding: 0, border: 'transparent' }} disabled={loading}>
            <List>
              <ListItem>
                <Skeleton variant="rectangular" height="4rem" width="100%" />
              </ListItem>
              <ListItem>
                <Skeleton variant="rectangular" height="4rem" width="100%" />
              </ListItem>
              <ListItem>
                <Skeleton variant="rectangular" height="4rem" width="100%" />
              </ListItem>
              <ListItem>
                <Skeleton variant="rectangular" height="4rem" width="100%" />
              </ListItem>
              <ListItem>
                <Button variant="contained" color="primary" fullWidth disabled>
                  Update
                </Button>
              </ListItem>
            </List>
          </fieldset>
        </StyledForm>
      )}
    </Layout>
  );
};

export default ProfilePage;
