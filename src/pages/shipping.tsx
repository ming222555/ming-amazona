import React, { useContext } from 'react';
import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';

import Layout from '../components/Layout';
import Link from '../components/Link';
import StateContext from '../utils/StateContext';

const ShippingPage: NextPage = () => {
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  return (
    <Layout title="Shopping Cart">
      <Typography variant="h1">Shopping Cart</Typography>
      {!userInfo.token ? (
        <div>
          Click <Link href="/login?redirect=/shipping">here</Link> to login
        </div>
      ) : (
        userInfo.token
      )}
    </Layout>
  );
};

export default ShippingPage;
