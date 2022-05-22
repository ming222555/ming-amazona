import React, { useState, useEffect, useContext } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';
import { PayPalButtons, usePayPalScriptReducer, SCRIPT_LOADING_STATE } from '@paypal/react-paypal-js';
import moment from 'moment';

import Layout from '../../components/Layout';
import { IFOrder } from '../../db/rdbms_tbl_cols';
import StateContext from '../../utils/StateContext';
import { getError } from '../../utils/error/frontend/error';
import StyledCard from '../../components/shared/StyledCard';
import Link from '../../components/shared/Link';

interface Props {
  id: string;
}

const OrderPage: NextPage<Props> = ({ id }: Props) => {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [order, setOrder] = useState<IFOrder | null>(null);
  const router = useRouter();

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      router.push(`/login?redirect=/order/${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (userInfo.token && id) {
      const fetchOrder = async (): Promise<void> => {
        try {
          const { data } = await axios.get<IFOrder>(`/api/orders/${id}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setOrder(data);
        } catch (err: unknown) {
          setAlert({
            open: true,
            message: getError(err),
            backgroundColor: '#FF3232',
          });
        }
      };
      fetchOrder();
    }
  }, [userInfo.token, id]);

  useEffect((): void => {
    if (order) {
      const loadPaypalScript = async (): Promise<void> => {
        try {
          const { data: clientId } = await axios.get<string>('/api/keys/paypal', {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          paypalDispatch({
            type: 'resetOptions',
            value: { 'client-id': clientId, currency: 'USD' },
          });
          paypalDispatch({
            type: 'setLoadingStatus',
            value: SCRIPT_LOADING_STATE.PENDING,
          });
        } catch (err: unknown) {
          setAlert({
            open: true,
            message: getError(err),
            backgroundColor: '#FF3232',
          });
        }
      };
      loadPaypalScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createOrder(data: any, actions: any): Promise<string> {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order?.totalPrice } }],
      })
      .then((orderID: string) => {
        return orderID;
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onApprove(data: any, actions: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return actions.order.capture().then(async function (details: any): Promise<void> {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await axios.put<IFOrder>(`/api/orders/${order?._id}/pay`, details, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setAlert({
          open: true,
          message: 'Order is paid',
          backgroundColor: '#4BB543',
        });
        setOrder(data);
      } catch (err: unknown) {
        setAlert({
          open: true,
          message: getError(err),
          backgroundColor: '#FF3232',
        });
      }
    });
  }

  function onError(err: unknown): void {
    setAlert({
      open: true,
      message: getError(err),
      backgroundColor: '#FF3232',
    });
  }

  const deliverOrderHandler = async (): Promise<void> => {
    try {
      setLoadingDeliver(true);
      const { data } = await axios.put<IFOrder>(
        `/api/orders/${order?._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );
      setLoadingDeliver(false);
      setAlert({
        open: true,
        message: 'Order is delivered',
        backgroundColor: '#4BB543',
      });
      setOrder(data);
    } catch (err: unknown) {
      setLoadingDeliver(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  const lat = order?.shippingAddress.location?.lat + '';
  const lng = order?.shippingAddress.location?.lng + '';

  let isNullPoint = false;

  if (lat === '0' && lng === '0') {
    isNullPoint = true;
  }

  const theme = useTheme();

  return (
    <Layout title="Order">
      <Typography variant="h1">Order {id}</Typography>
      {order ? (
        <>
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <StyledCard>
                <List>
                  <ListItem>
                    <Typography variant="h2">Shipping Address</Typography>
                  </ListItem>
                  <ListItem
                    sx={{
                      '&': {
                        flexDirection: 'column',
                        [theme.breakpoints.up(540)]: {
                          flexDirection: 'row',
                        },
                      },
                    }}
                  >
                    <Typography component="span" style={{ fontSize: '1rem' }}>
                      {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city},
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </Typography>
                    &nbsp;
                    {order.shippingAddress.location && !isNullPoint && (
                      <Link
                        variant="button"
                        target="_new"
                        href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                      >
                        Show On Map
                      </Link>
                    )}
                  </ListItem>
                  <ListItem>
                    <Typography component="span" style={{ fontSize: '1rem' }}>
                      Status:{' '}
                      {order.isDelivered
                        ? `delivered at ${moment(order.deliveredAt).local().format('dddd, MMMM Do, YYYY h:mm A')}`
                        : 'not delivered'}
                    </Typography>
                  </ListItem>
                </List>
              </StyledCard>
              <StyledCard>
                <List>
                  <ListItem>
                    <Typography variant="h2">Payment Method</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography component="span" style={{ fontSize: '1rem' }}>
                      {order.paymentMode}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography component="span" style={{ fontSize: '1rem' }}>
                      Status:{' '}
                      {order.isPaid
                        ? `paid at ${moment(order.paidAt).local().format('dddd, MMMM Do, YYYY h:mm A')}`
                        : 'not paid'}
                    </Typography>
                  </ListItem>
                </List>
              </StyledCard>
              <StyledCard>
                <List>
                  <ListItem>
                    <Typography variant="h2">Order Items</Typography>
                  </ListItem>
                  <ListItem>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderItems.map((item) => (
                            <TableRow key={item.name}>
                              <TableCell>
                                {/* <Link href={`/product/${item.slug}`}> */}
                                <Image src={item.image} alt={item.name} width={50} height={50} />
                                {/* </Link> */}
                              </TableCell>
                              <TableCell>
                                {/* <Link href={`/product/${item.slug}`}> */}
                                <Typography color="secondary">{item.name}</Typography>
                                {/* </Link> */}
                              </TableCell>
                              <TableCell align="right">
                                <Typography>{item.quantity}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>${item.price.toFixed(2)}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </ListItem>
                </List>
              </StyledCard>
            </Grid>
            <Grid item md={3} xs={12}>
              <StyledCard>
                <List>
                  <ListItem>
                    <Typography variant="h2">Order&nbsp;Summary</Typography>
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={4}>
                      <Grid item xs={3}>
                        <Typography>Items:</Typography>
                      </Grid>
                      <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                        <Typography align="right">${order.itemsPrice.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={4}>
                      <Grid item xs={3}>
                        <Typography>Tax:</Typography>
                      </Grid>
                      <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                        <Typography align="right">${order.taxPrice.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={4}>
                      <Grid item xs={3}>
                        <Typography>Shipping:</Typography>
                      </Grid>
                      <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                        <Typography align="right">${order.shippingPrice.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Divider style={{ width: '100%' }} />
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={4}>
                      <Grid item xs={3}>
                        <Typography>
                          <strong>Total:</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                        <Typography align="right">${order.totalPrice.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {!order.isPaid && (
                    <ListItem>
                      {isPending ? (
                        <CircularProgress />
                      ) : (
                        <div style={{ width: '100%' }}>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                    </ListItem>
                  )}
                  {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListItem>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={deliverOrderHandler}
                        disabled={loadingDeliver}
                        fullWidth
                      >
                        {loadingDeliver ? <CircularProgress size={30} /> : 'Deliver Order'}
                      </Button>
                    </ListItem>
                  )}
                </List>
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
          <Grid item md={9} xs={12}>
            <StyledCard>
              <List>
                <ListItem>
                  <Typography variant="h2">Shipping Address</Typography>
                </ListItem>
                <ListItem>
                  <Typography component="span" style={{ fontSize: '1rem' }}>
                    <Skeleton variant="rectangular" width="8rem" />
                  </Typography>
                </ListItem>
              </List>
            </StyledCard>
            <StyledCard>
              <List>
                <ListItem>
                  <Typography variant="h2">Payment Method</Typography>
                </ListItem>
                <ListItem>
                  <Typography component="span" style={{ fontSize: '1rem' }}>
                    <Skeleton variant="rectangular" width="8rem" />
                  </Typography>
                </ListItem>
              </List>
            </StyledCard>
            <StyledCard>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Items</Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
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
                          <TableCell align="right">
                            <Skeleton variant="rectangular" width="100%" />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </StyledCard>
          </Grid>
          <Grid item md={3} xs={12}>
            <StyledCard>
              <List>
                <ListItem>
                  <Typography variant="h2">Order&nbsp;Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container spacing={4}>
                    <Grid item xs={3}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                      <Typography align="right">
                        <Skeleton variant="rectangular" width="3rem" />
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={4}>
                    <Grid item xs={3}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                      <Typography align="right">
                        <Skeleton variant="rectangular" width="3rem" />
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={4}>
                    <Grid item xs={3}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                      <Typography align="right">
                        <Skeleton variant="rectangular" width="3rem" />
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Divider style={{ width: '3rem' }} />
                </ListItem>
                <ListItem>
                  <Grid container spacing={4}>
                    <Grid item xs={3}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                      <Typography align="right">
                        <Skeleton variant="rectangular" width="3rem" />
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </StyledCard>
          </Grid>
        </Grid>
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

export default OrderPage;
