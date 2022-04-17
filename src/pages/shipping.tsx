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
      {!userInfo.token ? (
        <div>
          Click <Link href="/login?redirect=/shipping">here</Link> to login
        </div>
      ) : cartItems.length > 0 ? (
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
      ) : (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      )}
    </Layout>
  );
};

export default ShippingPage;
