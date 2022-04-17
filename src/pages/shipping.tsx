import React, { useContext } from 'react';
import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';

import Layout from '../components/Layout';
import Link from '../components/Link';
import StateContext from '../utils/StateContext';

const ShippingPage: NextPage = () => {
  const { state } = useContext(StateContext);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  return (
    <Layout title="Shipping">
      <Typography variant="h1">Shipping</Typography>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : !userInfo.token ? (
        <div>
          Click <Link href="/login?redirect=/shipping">here</Link> to login
        </div>
      ) : (
        <div>
          <Typography>{userInfo.token}</Typography>
          {cartItems.map(
            (item): React.ReactNode => (
              <p key={item._id}>
                {item.name} {item.quantity}
              </p>
            ),
          )}
        </div>
      )}
    </Layout>
  );
};

export default ShippingPage;
