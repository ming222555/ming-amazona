import React, { useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';

import StateContext from '../utils/StateContext';

const ShippingPage: NextPage = () => {
  const router = useRouter();
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  let isLogined = true;

  if (!userInfo.token) {
    isLogined = false;
    router.push('/login?redirect=/shipping');
  }

  return (
    <div>
      <Typography variant="h1">Shipping</Typography>
      {isLogined ? <Typography>Shipping details...</Typography> : 'Redirecting to login...'}
    </div>
  );
};

export default ShippingPage;
