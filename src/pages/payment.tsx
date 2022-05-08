import React, { useContext, useRef, useEffect, useState } from 'react';
import type { NextPage } from 'next';
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
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import Link from '../components/shared/Link';
import { IFOrder } from '../db/rdbms_tbl_cols';
import StateContext from '../utils/StateContext';
import { getError } from '../utils/error/frontend/error';
import CheckoutWizard from '../components/shared/CheckoutWizard';
import StyledCard from '../components/shared/StyledCard';

const PREFIX = 'PaymentPage';

const StyledForm = styled('form')({
  [`&.${PREFIX}-form`]: {
    maxWidth: 800,
    margin: 'auto',
  },
});

interface IFFormData {
  paymentMode: string;
}

import { IFCartItem } from '../db/rdbms_tbl_cols';

const round2 = (num: number): number => Math.round(num * 100 + Number.EPSILON) / 100;

function getcartItemsPrice(total = 0, cartItem: IFCartItem): number {
  return total + cartItem.price * cartItem.quantity;
}

const PaymentPage: NextPage = () => {
  const gotoOrderPage = useRef(false);

  // https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<IFFormData>();

  const { dispatch, state } = useContext(StateContext);
  const {
    cart: { cartItems, shippingAddress },
    userInfo,
  } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const submitHandler = ({ paymentMode }: IFFormData): void => {
    setDialogOpen(true);
  };

  const placeOrderHandler = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await axios.post<IFOrder>(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMode: getValues().paymentMode,
          itemsPrice: cartItemsPrice,
          shippingPrice: cartShippingPrice,
          taxPrice: cartTaxPrice,
          totalPrice: cartTotalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );
      gotoOrderPage.current = true;
      dispatch({ type: 'CART_CLEAR' });
      router.push(`/order/${data._id}`);
    } catch (err: unknown) {
      setLoading(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  const hasMount = useRef(false);

  let badJsx: JSX.Element | null = null;

  if (hasMount.current) {
    if (cartItems.length === 0) {
      badJsx = (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      );
    } else if (shippingAddress.address && !userInfo.token) {
      badJsx = (
        <div>
          Click <Link href="/login?redirect=/shipping">here</Link> to login
        </div>
      );
    } else if (!shippingAddress.address && userInfo.token) {
      badJsx = (
        <div>
          You haven&apos;t entered a shipping address. Click <Link href="/shipping">here</Link> to enter shipping
          address
        </div>
      );
    } else if (!shippingAddress.address && !userInfo.token) {
      badJsx = (
        <div>
          You haven&apos;t entered a shipping address. Click <Link href="/login?redirect=/shipping">here</Link> to login
        </div>
      );
    }
  }

  let cartItemsPrice = 0;
  let cartShippingPrice = 0;
  let cartTaxPrice = 0;
  let cartTotalPrice = 0;

  if (dialogOpen) {
    cartItemsPrice = round2(cartItems.reduce(getcartItemsPrice, 0));
    cartShippingPrice = cartItemsPrice > 200 ? 0 : 15;
    cartTaxPrice = round2(cartItemsPrice * 0.15);
    cartTotalPrice = round2(cartItemsPrice + cartShippingPrice + cartTaxPrice);
  }

  useEffect(() => {
    if (!hasMount.current) {
      hasMount.current = true;

      const szCookieShippingAddress = Cookies.get('shippingAddress');

      if (szCookieShippingAddress) {
        dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: JSON.parse(szCookieShippingAddress) });
      }
    }
  }, [dispatch]);

  return (
    <Layout title="Payment">
      <Typography variant="h1">Payment</Typography>
      {!hasMount.current ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : gotoOrderPage.current ? (
        'Redirecting to your Order ...'
      ) : badJsx ? (
        <div>{badJsx}</div>
      ) : (
        <>
          <CheckoutWizard activeStep={2} hidden={dialogOpen ? true : undefined} />
          <StyledForm className={`${PREFIX}-form`} onSubmit={handleSubmit(submitHandler)}>
            <List>
              <ListItem>
                {/* https://codeat21.com/material-ui-with-react-hook-form-validation-with-error-messages/ */}
                <FormControl error={Boolean(errors.paymentMode)}>
                  <FormLabel component="legend">Payment Method</FormLabel>
                  <RadioGroup aria-label="paymentMode" name="paymentMode" /* row */>
                    <FormControlLabel
                      value="PayPal"
                      control={<Radio {...register('paymentMode', { required: 'Payment Method is required' })} />}
                      label="PayPal"
                    />
                    <FormControlLabel
                      value="Visa"
                      control={<Radio {...register('paymentMode', { required: 'Payment Method is required' })} />}
                      label="Visa"
                    />
                    <FormControlLabel
                      value="MasterCard"
                      control={<Radio {...register('paymentMode', { required: 'Payment Method is required' })} />}
                      label="MasterCard"
                    />
                  </RadioGroup>
                  <FormHelperText style={{ color: '#d32f2f' }}>{errors.paymentMode?.message}</FormHelperText>
                </FormControl>
              </ListItem>
              <ListItem>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Continue
                </Button>
              </ListItem>
              <ListItem>
                <Link href="/shipping" style={{ margin: 'auto', fontSize: '1rem' }}>
                  Back to Shipping
                </Link>
              </ListItem>
            </List>
          </StyledForm>
          <Dialog
            open={dialogOpen}
            PaperProps={{
              sx: {
                // minHeight: {
                //   xs: '100%', // theme.breakpoints.up('xs')
                //   md: 'auto', // theme.breakpoints.up('md')
                // },
                minWidth: {
                  xs: '100vw',
                  md: '75%',
                },
                maxWidth: {
                  md: 1200,
                },
              },
            }}
          >
            <DialogTitle style={{ position: 'relative' }}>
              <CheckoutWizard activeStep={3} />
              <IconButton
                disabled={loading}
                onClick={(): void => setDialogOpen(false)}
                style={{ position: 'absolute', background: '#d32f2f' }}
                sx={{
                  top: {
                    xs: '.5rem',
                    // md: '1rem',
                  },
                  right: {
                    xs: '.5rem',
                    // md: '-2rem',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography component="h2" variant="h1">
                Place Order
              </Typography>
              <Grid container spacing={1}>
                <Grid item md={9} xs={12}>
                  <StyledCard>
                    <List>
                      <ListItem>
                        <Typography variant="h2">Shipping Address</Typography>
                      </ListItem>
                      <ListItem>
                        <Typography component="span" style={{ fontSize: '1rem' }}>
                          {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city},
                          {shippingAddress.postalCode}, {shippingAddress.country}
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
                          {getValues().paymentMode}
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
                              {cartItems.map((item) => (
                                <TableRow key={item._id}>
                                  <TableCell>
                                    <Link href={`/product/${item.slug}`}>
                                      <Image src={item.image} alt={item.name} width={50} height={50} />
                                    </Link>
                                  </TableCell>
                                  <TableCell>
                                    <Link href={`/product/${item.slug}`}>
                                      <Typography color="secondary">{item.name}</Typography>
                                    </Link>
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
                            <Typography align="right">${cartItemsPrice.toFixed(2)}</Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <ListItem>
                        <Grid container spacing={4}>
                          <Grid item xs={3}>
                            <Typography>Tax:</Typography>
                          </Grid>
                          <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                            <Typography align="right">${cartTaxPrice.toFixed(2)}</Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <ListItem>
                        <Grid container spacing={4}>
                          <Grid item xs={3}>
                            <Typography>Shipping:</Typography>
                          </Grid>
                          <Grid item xs={9} style={{ flexBasis: 'auto', marginLeft: 'auto' }}>
                            <Typography align="right">${cartShippingPrice.toFixed(2)}</Typography>
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
                            <Typography align="right">
                              {/* <strong> */}${cartTotalPrice.toFixed(2)}
                              {/* </strong> */}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={loading}
                          onClick={placeOrderHandler}
                          fullWidth
                        >
                          {loading ? <CircularProgress size={30} /> : 'Place Order'}
                        </Button>
                      </ListItem>
                    </List>
                  </StyledCard>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
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
    </Layout>
  );
};

export default PaymentPage;
