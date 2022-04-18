import React, { useContext, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';

import axios from 'axios';

import Link from '../../components/Link';
import Layout from '../../components/Layout';
import db from '../../db/db';
import Product from '../../db/models/Product';
import { IFProduct } from '../../db/rdbms_tbl_cols';
import StateContext from '../../utils/StateContext';

const StyledTopSection = styled('section')({
  marginTop: 10,
  marginBottom: 10,
});

interface Props {
  product: IFProduct;
}

const ProductPage: NextPage<Props> = ({ product }: Props) => {
  const router = useRouter();
  const { state, dispatch } = useContext(StateContext);

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = async (): Promise<void> => {
    const { data } = await axios.get<IFProduct>(`/api/products/${product._id}`);
    const existCartItem = state.cart.cartItems.find((item) => item._id === product._id);
    if (existCartItem) {
      const quantity = existCartItem.quantity + 1;
      if (data.countInStock < quantity) {
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
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div>
        <StyledTopSection>
          <IconButton style={{ background: 'transparent' }} component={Link} href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/backArrow.svg" alt="back to landing page" />
          </IconButton>
          <Link href="/">
            <Typography component="span" color="primary">
              back to products
            </Typography>
          </Link>
        </StyledTopSection>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <Image src={product.image} alt={product.name} width={640} height={640} layout="responsive" />
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography variant="h1">{product.name}</Typography>
              </ListItem>
              <ListItem>
                <Typography>Category: {product.category}</Typography>
              </ListItem>
              <ListItem>
                <Typography>Brand: {product.brand}</Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  Rating: {product.rating} stars ({product.numReviews} reviews)
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>Description: {product.description}</Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Price</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>${product.price}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Status</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button fullWidth variant="contained" color="primary" onClick={addToCartHandler}>
                    Add to cart
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const slug = context.params?.slug;

  await db.connect();
  const product = (await Product.findOne({ slug }).lean()) as IFProduct;
  db.convertDocToObj(product);
  await db.disconnect();
  return {
    props: {
      product,
    },
  };
};

export default ProductPage;
