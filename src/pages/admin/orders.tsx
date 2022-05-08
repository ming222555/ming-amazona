import React, { useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
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
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';

import Layout from '../../components/Layout';
import { IFOrder } from '../../db/rdbms_tbl_cols';
import StateContext from '../../utils/StateContext';
import Link from '../../components/shared/Link';
import { getError } from '../../utils/error/frontend/error';
import StyledCard from '../../components/shared/StyledCard';

const PREFIX = 'AdminOrdersPage';

const StyledPresentTabButton = styled(Button)(({ theme }) => ({
  [`&.Mui-disabled.${PREFIX}-present-tab`]: {
    background: theme.palette.secondary.main,
    color: '#000',
  },
}));

const AdminOrdersPage: NextPage = () => {
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  interface IFOrderWithUsername extends IFOrder {
    user?: { name: string };
  }

  const [orderList, setOrderList] = useState<IFOrderWithUsername[] | null>(null);
  const router = useRouter();

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      router.push('/login?redirect=/admin/orders');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (userInfo.token) {
      if (userInfo.isAdmin) {
        const fetchorderList = async (): Promise<void> => {
          try {
            const { data } = await axios.get<IFOrder[]>('/api/admin/orders', {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            setOrderList(data);
          } catch (err: unknown) {
            setAlert({
              open: true,
              message: getError(err),
              backgroundColor: '#FF3232',
            });
          }
        };
        fetchorderList();
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
      <StyledPresentTabButton
        variant="contained"
        size="medium"
        style={{ borderRadius: 0, marginRight: 4 }}
        disabled
        classes={{ disabled: `${PREFIX}-present-tab` }}
      >
        Orders
      </StyledPresentTabButton>
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
    <Layout title="Admin">
      <Typography variant="h1">Admin</Typography>
      {orderList && orderList.length > 0 ? (
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
                          <TableCell>USER</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderList.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.user ? order.user.name : 'DELETED'}</TableCell>
                            <TableCell>{moment(order.createAt).local().format('dddd, MMMM Do, YYYY h:mm A')}</TableCell>
                            <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${moment(order.paidAt).local().format('dddd, MMMM Do, YYYY h:mm A')}`
                                : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${moment(order.deliveredAt)
                                    .local()
                                    .format('dddd, MMMM Do, YYYY h:mm A')}`
                                : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <Link href={`/order/${order._id}`}>
                                <Button variant="contained" size="small">
                                  Details
                                </Button>
                              </Link>
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
      ) : orderList && orderList.length === 0 ? (
        <>
          {tabs}
          <Card style={{ borderRadius: 0 }}>
            <List>
              <ListItem>
                <Typography variant="h2">Orders not found</Typography>
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
                        <TableCell>USER</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>TOTAL</TableCell>
                        <TableCell>PAID</TableCell>
                        <TableCell>DELIVERED</TableCell>
                        <TableCell>ACTION</TableCell>
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

export default AdminOrdersPage;
