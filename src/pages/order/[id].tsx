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
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
// import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';

import Layout from '../../components/Layout';
import { IFOrder } from '../../db/rdbms_tbl_cols';
import StateContext from '../../utils/StateContext';
import { getError } from '../../utils/error/frontend/error';
import CheckoutWizard from '../../components/shared/checkoutWizard';

const StyledCard = styled(Card)({
  marginTop: 4,
});

interface Props {
  id: string;
}

const OrderPage: NextPage<Props> = ({ id }: Props) => {
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [gotoLogin, setGotoLogin] = useState(false);
  const [order, setOrder] = useState<IFOrder | null>(null);
  const router = useRouter();

  if (gotoLogin) {
    router.push(`/login?redirect=/order/${id}`);
  }

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      setGotoLogin(true);
    }
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fetchOrder();
    }
  }, [userInfo.token, id]);

  return (
    <Layout title="Order">
      <Typography variant="h1">Order {id}</Typography>
      {order ? (
        <>
          <CheckoutWizard activeStep={3} />
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <StyledCard>
                <List>
                  <ListItem>
                    <Typography variant="h2">Shipping Address</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography component="span" style={{ fontSize: '1rem' }}>
                      {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city},
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography component="span" style={{ fontSize: '1rem' }}>
                      Status: {order.isDelivered ? `deilivered at ${order.deliveredAt}` : 'not delivered'}
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
                      Status: {order.isPaid ? `paid at ${order.paidAt}` : 'not paid'}
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
                                <Typography>${item.price}</Typography>
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
                        <Typography align="right">${order.itemsPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={4}>
                      <Grid item xs={3}>
                        <Typography>Tax:</Typography>
                      </Grid>
                      <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                        <Typography align="right">${order.taxPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={4}>
                      <Grid item xs={3}>
                        <Typography>Shipping:</Typography>
                      </Grid>
                      <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                        <Typography align="right">${order.shippingPrice}</Typography>
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
                        <Typography align="right">${order.totalPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      color="secondary"
                      // disabled={loading}
                      // onClick={placeOrderHandler}
                      fullWidth
                    >
                      {/* {loading ? <CircularProgress size={30} /> : 'Place Order'} */}
                      Pay Now
                    </Button>
                  </ListItem>
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
        <>
          <CheckoutWizard activeStep={3} />
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
        </>
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
