import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';

import Layout from '../components/Layout';
import db from '../db/db';
import Product from '../db/models/Product';
import { IFProduct } from '../db/rdbms_tbl_cols';
import ProductItem from '../components/shared/ProductItem';
import useAddToCartHandler from '../hooks/shared/useAddToCartHandler';

interface Props {
  products: IFProduct[];
}

// https://github.com/yannickcr/eslint-plugin-react/issues/2353
const Home: NextPage<Props> = ({ products }: Props) => {
  const theme = useTheme();
  const { loadingAddToCart, alertAddToCart, setAlertAddToCart, addToCartHandler } = useAddToCartHandler();

  return (
    <Layout>
      <div>
        <h1 style={{ color: theme.palette.primary.main }}>Products</h1>
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item md={4} key={p.name}>
              <ProductItem product={p} loadingAddToCart={loadingAddToCart} addToCartHandler={addToCartHandler} />
            </Grid>
          ))}
        </Grid>
        <Snackbar
          open={alertAddToCart.open}
          message={alertAddToCart.message}
          ContentProps={{ style: { backgroundColor: alertAddToCart.backgroundColor } }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={(): void => setAlertAddToCart({ ...alertAddToCart, open: false })}
          autoHideDuration={4000}
        />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await db.connect();
  const products = (await Product.find({}, '-reviews').lean()) as IFProduct[];
  products.forEach(db.convertDocToObj);
  await db.disconnect();
  return {
    props: {
      products,
    },
  };
};

export default Home;
