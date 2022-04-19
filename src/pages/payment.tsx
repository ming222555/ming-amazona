import React, { useContext, useRef, useEffect } from 'react';
import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';

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
    register,
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
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const xxxxx = paymentMode;
    // eslint-disable-next-line no-console
    console.log('paymentMode', paymentMode);
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
                {/* https://codeat21.com/material-ui-with-react-hook-form-validation-with-error-messages/ */}
                <FormControl error={Boolean(errors.paymentMode)}>
                  <FormLabel component="legend">Payment Method</FormLabel>
                  <RadioGroup aria-label="paymentMode" name="paymentMode" /* row */>
                    <FormControlLabel
                      value="female"
                      control={<Radio {...register('paymentMode', { required: 'Payment Method is required' })} />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio {...register('paymentMode', { required: 'Payment Method is required' })} />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio {...register('paymentMode', { required: 'Payment Method is required' })} />}
                      label="Other"
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
        </>
      )}
    </Layout>
  );
};

export default PaymentPage;
