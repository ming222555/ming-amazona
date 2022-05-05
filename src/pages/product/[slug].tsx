import React, { useContext, useState, useEffect, useCallback } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import moment from 'moment';

import Link from '../../components/Link';
import Layout from '../../components/Layout';
import db from '../../db/db';
import Product from '../../db/models/Product';
import { IFProduct, IFProductReview } from '../../db/rdbms_tbl_cols';
import StateContext from '../../utils/StateContext';
import { getError } from '../../utils/error/frontend/error';

const StyledTopSection = styled('section')({
  marginTop: 10,
  marginBottom: 10,
});

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  borderRadius: 4,
  marginTop: '1rem',
  border: '1px solid ' + theme.palette.common.lightBlue,
  opacity: 0.8,
  [theme.breakpoints.up('md')]: {
    width: '80%',
  },
}));

interface Props {
  product: IFProduct;
}

const ProductPage: NextPage<Props> = ({ product }: Props) => {
  const router = useRouter();
  const { state, dispatch } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);
  // const [reviews, setReviews] = useState(product.reviews ? product.reviews : []);
  const [reviews, setReviews] = useState<IFProductReview[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchreviews = useCallback(async () => {
    try {
      const { data } = await axios.get<IFProductReview[]>(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err: unknown) {
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    fetchreviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = async (): Promise<void> => {
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
      // Catch clause variable type annotation must be 'any' or 'unknown' if specified.ts(1196)
      // https://stackoverflow.com/questions/69021040/why-catch-clause-variable-type-annotation-must-be-any
    } catch (err: unknown) {
      setLoading(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  const submitHandler = async (e: React.SyntheticEvent<Element, Event>): Promise<void> => {
    e.preventDefault();

    const commentTrim = comment.trim();

    if (!commentTrim) {
      setAlert({
        open: true,
        message: 'Comment is required',
        backgroundColor: '#FF3232',
      });
      return;
    }

    setLoadingSubmitReview(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post<{ message: string }>(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment: commentTrim,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );
      setLoadingSubmitReview(false);
      setComment('');
      setRating(0);
      setAlert({
        open: true,
        message: 'Review submitted successfully',
        backgroundColor: '#4BB543',
      });
      fetchreviews();
    } catch (err: unknown) {
      setLoadingSubmitReview(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
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
                <Rating value={product.rating} readOnly />
                <Link
                  color="secondary"
                  href="#reviews"
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Typography color="secondary">({product.numReviews} reviews)</Typography>
                </Link>
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
                      <Typography>${product.price.toFixed(2)}</Typography>
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
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={addToCartHandler}
                    disabled={loading || loadingSubmitReview}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={30} /> : 'Add to cart'}
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
        <List>
          <ListItem>
            <Typography id="reviews" variant="h2">
              Customer Reviews
            </Typography>
          </ListItem>
          {reviews.length === 0 && <ListItem>No review</ListItem>}
          {reviews.map((review, i) => (
            <ListItem key={review._id}>
              <Grid container>
                <Grid item style={{ paddingRight: 4 }}>
                  <Typography
                    style={{ minWidth: '9rem', borderTop: i === 0 ? undefined : '1px solid' }}
                    sx={{ borderColor: 'primary' }}
                  >
                    <strong>{review.name}</strong>
                  </Typography>
                  <Typography style={{ fontSize: '.9rem' }}>
                    {moment(review.createAt).local().format('ddd, MMMM Do, YYYY')}
                  </Typography>
                </Grid>
                <Grid item style={{ paddingLeft: 4, maxWidth: '100%' /* background: 'lightblue' */ }}>
                  <Rating
                    value={review.rating}
                    readOnly
                    style={{ borderTop: i === 0 ? undefined : '1px solid' }}
                    sx={{ borderColor: 'primary' }}
                  />
                  <Typography
                    style={{
                      fontSize: '1rem',
                      whiteSpace: 'pre-line',
                      /*  background: 'yellow', */
                      wordWrap: 'break-word',
                    }}
                  >
                    {review.comment}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
          <ListItem>
            {userInfo.token ? (
              <StyledForm onSubmit={submitHandler}>
                <List>
                  <ListItem>
                    <Typography variant="h2">Leave your review</Typography>
                  </ListItem>
                  <ListItem>
                    <TextField
                      multiline
                      variant="outlined"
                      fullWidth
                      name="review"
                      label="Enter comment"
                      value={comment}
                      onChange={(e): void => setComment(e.target.value)}
                      inputProps={{ maxLength: 150 }}
                    />
                  </ListItem>
                  <ListItem>
                    <Rating
                      name="rating"
                      value={rating}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(e: any): void => setRating(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading || loadingSubmitReview}
                      fullWidth
                    >
                      {loadingSubmitReview ? <CircularProgress size={30} /> : 'Submit'}
                    </Button>
                  </ListItem>
                </List>
              </StyledForm>
            ) : (
              <Typography variant="h2">
                Please{' '}
                <Link href={`/login?redirect=/product/${product.slug}`} color="secondary">
                  login
                </Link>{' '}
                to write a review
              </Typography>
            )}
          </ListItem>
        </List>
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
  delete product.reviews;
  return {
    props: {
      product,
    },
  };
};

export default ProductPage;
