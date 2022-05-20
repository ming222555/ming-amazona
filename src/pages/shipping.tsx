import React, { useContext, useRef, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import Link from '../components/shared/Link';
import { IFShippingAddress } from '../db/rdbms_tbl_cols';
import StateContext from '../utils/StateContext';
import CheckoutWizard from '../components/shared/CheckoutWizard';

const PREFIX = 'ShippingPage';

const StyledShippingForm = styled('form')({
  [`&.${PREFIX}-shippingform`]: {
    maxWidth: 800,
    margin: 'auto',
  },
});

interface IFFormData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const ShippingPage: NextPage = () => {
  // https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<IFFormData>();

  const { dispatch, state } = useContext(StateContext);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  const router = useRouter();

  const submitHandler = ({ fullName, address, city, postalCode, country }: IFFormData): void => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName: fullName.trim(),
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      } as IFShippingAddress,
    });
    router.push('/payment');
  };

  const hasMount = useRef(false);
  const location = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!hasMount.current) {
      hasMount.current = true;

      const szCookieShippingAddress = Cookies.get('shippingAddress');

      if (szCookieShippingAddress) {
        const shippingAddress: IFShippingAddress = JSON.parse(szCookieShippingAddress);
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('postalCode', shippingAddress.postalCode);
        setValue('country', shippingAddress.country);
        location.current = {
          lat: shippingAddress.location ? shippingAddress.location.lat : 0,
          lng: shippingAddress.location ? shippingAddress.location.lng : 0,
        };
        dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: JSON.parse(szCookieShippingAddress) });
      }
    }
  }, [dispatch, setValue]);

  const chooseLocationHandler = (): void => {
    const fullName = getValues('fullName').trim();
    const address = getValues('address').trim();
    const city = getValues('city').trim();
    const postalCode = getValues('postalCode').trim();
    const country = getValues('country').trim();
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country } as IFShippingAddress,
    });
    router.push('/google-map');
  };

  return (
    <Layout title="Shipping Address">
      <Typography variant="h1">Shipping Address</Typography>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : !userInfo.token ? (
        <div>
          Click <Link href="/login?redirect=/shipping">here</Link> to login
        </div>
      ) : (
        <>
          <CheckoutWizard activeStep={1} />
          <StyledShippingForm className={`${PREFIX}-shippingform`} onSubmit={handleSubmit(submitHandler)}>
            <List>
              <ListItem>
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue=""
                  rules={{ required: true, minLength: 6 }}
                  render={({ field }): JSX.Element => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="fullName"
                      label="Full Name"
                      error={Boolean(errors.fullName)}
                      helperText={
                        errors.fullName
                          ? errors.fullName.type === 'minLength'
                            ? 'Full Name length is more than 5'
                            : 'Full Name is required'
                          : ''
                      }
                      {...field}
                    />
                  )}
                />
              </ListItem>
              <ListItem>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  rules={{ required: true, minLength: 6 }}
                  render={({ field }): JSX.Element => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="address"
                      label="Address"
                      error={Boolean(errors.address)}
                      helperText={
                        errors.address
                          ? errors.address.type === 'minLength'
                            ? 'Address length is more than 5'
                            : 'Address is required'
                          : ''
                      }
                      {...field}
                    />
                  )}
                />
              </ListItem>
              <ListItem>
                <Controller
                  name="city"
                  control={control}
                  defaultValue=""
                  rules={{ required: true, minLength: 6 }}
                  render={({ field }): JSX.Element => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="city"
                      label="City"
                      error={Boolean(errors.city)}
                      helperText={
                        errors.city
                          ? errors.city.type === 'minLength'
                            ? 'City length is more than 5'
                            : 'City is required'
                          : ''
                      }
                      {...field}
                    />
                  )}
                />
              </ListItem>
              <ListItem>
                <Controller
                  name="postalCode"
                  control={control}
                  defaultValue=""
                  rules={{ required: true, minLength: 6 }}
                  render={({ field }): JSX.Element => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="postalCode"
                      label="Postal Code"
                      error={Boolean(errors.postalCode)}
                      helperText={
                        errors.postalCode
                          ? errors.postalCode.type === 'minLength'
                            ? 'Postal Code length is more than 5'
                            : 'Postal Code is required'
                          : ''
                      }
                      {...field}
                    />
                  )}
                />
              </ListItem>
              <ListItem>
                <Controller
                  name="country"
                  control={control}
                  defaultValue=""
                  rules={{ required: true, minLength: 6 }}
                  render={({ field }): JSX.Element => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="country"
                      label="Country"
                      error={Boolean(errors.country)}
                      helperText={
                        errors.country
                          ? errors.country.type === 'minLength'
                            ? 'Country length is more than 5'
                            : 'Country is required'
                          : ''
                      }
                      {...field}
                    />
                  )}
                />
              </ListItem>
              <ListItem>
                <Button variant="contained" color="secondary" type="button" onClick={chooseLocationHandler}>
                  Choose on map
                </Button>
                &nbsp;
                <Typography style={{ fontSize: '1rem' }}>
                  {location.current &&
                    location.current.lat !== 0 &&
                    location.current.lng !== 0 &&
                    `${location.current.lat}, ${location.current.lng}`}
                </Typography>
              </ListItem>
              <ListItem>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Continue
                </Button>
              </ListItem>
            </List>
          </StyledShippingForm>
        </>
      )}
    </Layout>
  );
};

export default ShippingPage;
