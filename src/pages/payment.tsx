import React, { useContext, useRef, useEffect } from 'react';
import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import Link from '../components/Link';
// import { IFPayment } from '../db/rdbms_tbl_cols';
import StateContext from '../utils/StateContext';
import CheckoutWizard from '../components/shared/checkoutWizard';

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

const PaymentPage: NextPage = () => {
  // https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFFormData>();

  const { dispatch, state } = useContext(StateContext);
  const {
    cart: { cartItems, shippingAddress },
    userInfo,
  } = state;

  const submitHandler = ({ paymentMode }: IFFormData): void => {
    // dispatch({
    //   type: 'SAVE_SHIPPING_ADDRESS',
    //   payload: { fullName, address, city, postalCode, country } as IFPayment,
    // });
    // router.push('/payment');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const xxxxx = paymentMode;
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
      ) : badJsx ? (
        <div>{badJsx}</div>
      ) : (
        <>
          <CheckoutWizard activeStep={2} />
          <StyledForm className={`${PREFIX}-form`} onSubmit={handleSubmit(submitHandler)}>
            <List>
              <ListItem>
                visa
                <Controller
                  name="paymentMode"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }): JSX.Element => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="paymentMode"
                      label="Payment Mode"
                      error={Boolean(errors.paymentMode)}
                      helperText={errors.paymentMode ? 'Payment Mode is required' : ''}
                      {...field}
                    />
                  )}
                />
              </ListItem>
              <ListItem>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Continue
                </Button>
              </ListItem>
              <ListItem>
                <Link href="/shipping" style={{ margin: 'auto', fontSize: '1rem' }}>
                  Back to Shipping Address
                </Link>
              </ListItem>
            </List>
          </StyledForm>
        </>
      )}
    </Layout>
  );
};

export default PaymentPage;
