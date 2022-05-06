import React, { useContext, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';
import { useTheme } from '@mui/material/styles';

import axios from 'axios';

import Link from '../components/Link';
import Layout from '../components/Layout';
import db from '../db/db';
import Product from '../db/models/Product';
import { IFProduct } from '../db/rdbms_tbl_cols';
import StateContext from '../utils/StateContext';
import { getError } from '../utils/error/frontend/error';

interface Props {
  products: IFProduct[];
}

// https://github.com/yannickcr/eslint-plugin-react/issues/2353
const Home: NextPage<Props> = ({ products }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { state, dispatch } = useContext(StateContext);

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [loading, setLoading] = useState(false);

  const addToCartHandler = async (product: IFProduct): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get<IFProduct>(`/api/products/${product._id}`);
      const { data } = res;
      const existCartItem = state.cart.cartItems.find((item) => item._id === product._id);
      if (existCartItem) {
        const quantity = existCartItem.quantity + 1;
        if (data.countInStock < quantity) {
          setLoading(false);
          setAlert({
            open: true,
            message: 'Sorry. Product is out of stock',
            backgroundColor: '#FF3232',
          });
          return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...existCartItem, quantity } });
        router.push('/cart');
        return;
      }
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
      router.push('/cart');
    } catch (err: unknown) {
      setLoading(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  return (
    <Layout>
      <div>
        <h1 style={{ color: theme.palette.primary.main }}>Products</h1>
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item md={4} key={p.name}>
              <Card>
                <Link href={`/product/${p.slug}`}>
                  <CardActionArea>
                    <CardMedia component="img" image={p.image} title={p.name} />
                    <CardContent>
                      <Typography>{p.name}</Typography>
                      <Rating value={p.rating} readOnly />
                    </CardContent>
                  </CardActionArea>
                </Link>
                <CardActions>
                  <Typography>${p.price.toFixed(2)}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={(): void => {
                      addToCartHandler(p);
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={30} /> : 'Add to cart'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Snackbar
          open={alert.open}
          message={alert.message}
          ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={(): void => setAlert({ ...alert, open: false })}
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
