import React, { useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';

import Layout from '../components/Layout';
import { IFOrder } from '../db/rdbms_tbl_cols';
import StateContext from '../utils/StateContext';
import Link from '../components/Link';
import { getError } from '../utils/error/frontend/error';
import StyledCard from '../components/shared/StyledCard';

const OrderHistoryPage: NextPage = () => {
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [orderList, setOrderList] = useState<IFOrder[] | null>(null);
  const router = useRouter();

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      router.push('/login?redirect=/order-history');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (userInfo.token) {
      const fetchOrderList = async (): Promise<void> => {
        try {
          const { data } = await axios.get<IFOrder[]>('/api/orders/history', {
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
      fetchOrderList();
    }
  }, [userInfo.token]);

  return (
    <Layout title="Order History">
      <Typography variant="h1">Order History</Typography>
      {orderList && orderList.length > 0 ? (
        <>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <StyledCard>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
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
                          <TableCell>{moment(order.createAt).local().format('dddd, MMMM Do, YYYY h:mm A')}</TableCell>
                          <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            {order.isPaid
                              ? `paid at ${moment(order.paidAt).local().format('dddd, MMMM Do, YYYY h:mm A')}`
                              : 'not paid'}
                          </TableCell>
                          <TableCell>
                            {order.isDelivered
                              ? `delivered at ${moment(order.deliveredAt).local().format('dddd, MMMM Do, YYYY h:mm A')}`
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
            </Grid>
          </Grid>
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
        <Typography variant="h2">You have no Orders</Typography>
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
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <StyledCard>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
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
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </StyledCard>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default OrderHistoryPage;
