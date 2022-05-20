import React, { useState, useEffect, useContext } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';

import Layout from '../../../components/Layout';
import { IFUser } from '../../../db/rdbms_tbl_cols';
import StateContext from '../../../utils/StateContext';
import Link from '../../../components/shared/Link';
import { getError } from '../../../utils/error/frontend/error';
import demo from '../../../demo';

const PREFIX = 'UserEditPage';

const StyledForm = styled('form')({
  [`&.${PREFIX}-form`]: {
    maxWidth: 800,
    margin: 'auto',
  },
});

interface IFFormData {
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  countInStock: number;
  description: string;
}

interface Props {
  id: string;
}

const UserEditPage: NextPage<Props> = ({ id }: Props) => {
  // https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFFormData>();
  const [isAdmin, setIsAdmin] = useState(false);

  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<IFUser | null>(null);
  const router = useRouter();

  const submitHandler = async ({ name }: IFFormData): Promise<void> => {
    if (demo) {
      setAlert({
        open: true,
        message: `Website for demo only. Update of user not allowed.`,
        backgroundColor: '#FF3232',
      });
      return;
    }

    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.put<{ message: string }>(
        `/api/admin/users/${id}`,
        { ...user, name, isAdmin },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );
      setLoading(false);
      setAlert({
        open: true,
        message: 'User updated successfully',
        backgroundColor: '#4BB543',
      });
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
      router.push(`/login?redirect=/admin/user/${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (userInfo.token) {
      if (userInfo.isAdmin) {
        const fetchuser = async (): Promise<void> => {
          try {
            const { data } = await axios.get<IFUser>(`/api/admin/users/${id}`, {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            setValue('name', data.name);
            setIsAdmin(data.isAdmin);
            setUser(data);
          } catch (err: unknown) {
            setAlert({
              open: true,
              message: getError(err),
              backgroundColor: '#FF3232',
            });
          }
        };
        fetchuser();
      } else {
        router.push('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.token]);

  const tabs: React.ReactNode = (
    <>
      <Link href="/admin/dashboard" style={{ marginRight: 4 }}>
        <Button
          variant="contained"
          disableRipple
          disableElevation
          size="medium"
          color="primary"
          style={{ borderRadius: 0 }}
        >
          Dashboard
        </Button>
      </Link>
      <Link href="/admin/orders" style={{ marginRight: 4 }}>
        <Button
          variant="contained"
          disableRipple
          disableElevation
          size="medium"
          color="primary"
          style={{ borderRadius: 0 }}
        >
          Orders
        </Button>
      </Link>
      <Link href="/admin/users" style={{ marginRight: 4 }}>
        <Button
          variant="contained"
          disableRipple
          disableElevation
          size="medium"
          color="primary"
          style={{ borderRadius: 0 }}
        >
          Products
        </Button>
      </Link>
      <Link href="/admin/users">
        <Button
          variant="contained"
          disableRipple
          disableElevation
          size="medium"
          color="primary"
          style={{ borderRadius: 0 }}
        >
          Users
        </Button>
      </Link>
    </>
  );

  return (
    <Layout title="Edit User">
      <Typography variant="h1">Edit User {id}</Typography>
      {user ? (
        <>
          {tabs}
          <Card style={{ borderRadius: 0 }}>
            <List>
              <ListItem>
                <StyledForm
                  className={`${PREFIX}-form`}
                  onSubmit={handleSubmit(submitHandler)}
                  style={{ width: '100%' }}
                >
                  <fieldset style={{ margin: 0, padding: 0, border: 'transparent' }} disabled={loading}>
                    <List>
                      <ListItem>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="name"
                              label="Name"
                              error={Boolean(errors.name)}
                              helperText={errors.name ? 'Name is required' : ''}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          label="Is Admin"
                          control={
                            <Checkbox
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onClick={(e: any): void => setIsAdmin(e.target.checked)}
                              checked={isAdmin}
                              name="isAdmin"
                            />
                          }
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
              </ListItem>
            </List>
          </Card>
          <Snackbar
            open={alert.open}
            message={alert.message}
            ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={(): void => {
              setAlert({ ...alert, open: false });
              if (alert.message === 'User updated successfully') {
                router.push('/admin/users');
              }
            }}
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
        <StyledForm className={`${PREFIX}-form`}>
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const id = context.params?.id as string;

  return {
    props: {
      id,
    },
  };
};

export default UserEditPage;
