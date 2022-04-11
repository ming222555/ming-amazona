import React from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';

import Link from '../../components/Link';
import Layout from '../../components/Layout';
import data from '../../db/seeddata';

const StyledTopSection = styled('section')({
  marginTop: 10,
  marginBottom: 10,
});

const ProductPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }
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
                  <Button fullWidth variant="contained" color="primary">
                    Add to cart
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default ProductPage;
