import React, { useState, useEffect, useContext, useRef } from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';

import Layout from '../../components/Layout';
import { IFUser } from '../../db/rdbms_tbl_cols';
import StateContext from '../../utils/StateContext';
import Link from '../../components/Link';
import { getError } from '../../utils/error/frontend/error';
import StyledCard from '../../components/shared/StyledCard';

const PREFIX = 'AdminUsersPage';

const StyledPresentTabButton = styled(Button)(({ theme }) => ({
  [`&.Mui-disabled.${PREFIX}-present-tab`]: {
    background: theme.palette.secondary.main,
    color: '#000',
  },
}));

const AdminUsersPage: NextPage = () => {
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [userList, setUserList] = useState<IFUser[] | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const router = useRouter();

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      router.push('/login?redirect=/admin/users');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchuserList = async (): Promise<void> => {
    try {
      const { data } = await axios.get<IFUser[]>('/api/admin/users', {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setUserList(data);
    } catch (err: unknown) {
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  useEffect((): void => {
    if (userInfo.token) {
      if (userInfo.isAdmin) {
        fetchuserList();
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
      <Link href="/admin/products" style={{ marginRight: 4 }}>
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
      <StyledPresentTabButton
        variant="contained"
        size="medium"
        style={{ borderRadius: 0 }}
        disabled
        classes={{ disabled: `${PREFIX}-present-tab` }}
      >
        Users
      </StyledPresentTabButton>
    </>
  );

  const deletedUser = useRef<true | null>(null);

  const deleteHandler = async (userId: string): Promise<void> => {
    try {
      setLoadingDelete(true);
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setLoadingDelete(false);
      deletedUser.current = true;
      setAlert({
        open: true,
        message: 'User deleted successfully',
        backgroundColor: '#4BB543',
      });
    } catch (err: unknown) {
      setLoadingDelete(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  useEffect((): void => {
    if (deletedUser.current) {
      if (userInfo.token) {
        if (userInfo.isAdmin) {
          deletedUser.current = null; // reset
          fetchuserList();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedUser.current]);

  return (
    <Layout title="Admin">
      <Typography variant="h1">Admin</Typography>
      {userList && userList.length > 0 ? (
        <>
          {tabs}
          <Card style={{ borderRadius: 0 }}>
            <List>
              <ListItem>
                <StyledCard>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell>ISADMIN</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userList.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id.substring(20, 24)}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isAdmin ? 'YES' : 'NO'}</TableCell>
                            <TableCell>
                              <Link
                                href={`/admin/user/${user._id}`}
                                onClick={(e: React.SyntheticEvent<Element, Event>): void => {
                                  if (loadingDelete) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <IconButton disabled={loadingDelete}>
                                  <EditIcon />
                                </IconButton>
                              </Link>
                              <IconButton
                                disabled={loadingDelete}
                                onClick={(): void => {
                                  deleteHandler(user._id);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </StyledCard>
              </ListItem>
            </List>
          </Card>
          <Snackbar
            open={alert.open}
            message={alert.message}
            ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={(): void => setAlert({ ...alert, open: false })}
            autoHideDuration={4000}
          />
        </>
      ) : userList && userList.length === 0 ? (
        <>
          {tabs}
          <Card style={{ borderRadius: 0 }}>
            <List>
              <ListItem>
                <Typography variant="h2">Users not found</Typography>
              </ListItem>
            </List>
          </Card>
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
        <Card>
          <List>
            <ListItem>
              <StyledCard>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>NAME</TableCell>
                        <TableCell>PRICE</TableCell>
                        <TableCell>CATEGORY</TableCell>
                        <TableCell>COUNT</TableCell>
                        <TableCell>RATING</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledCard>
            </ListItem>
          </List>
        </Card>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(AdminUsersPage), { ssr: false });
