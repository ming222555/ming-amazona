import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import Layout from '../components/Layout';
import db from '../db/db';
import Product from '../db/models/Product';
import { IFProduct } from '../db/rdbms_tbl_cols';
import ProductItem from '../components/shared/ProductItem';
import useAddToCartHandler from '../hooks/shared/useAddToCartHandler';

const PREFIX = 'Home';

const StyledCarousel = styled(Carousel)({
  [`&.carousel-root.${PREFIX}-carousel > .carousel > .thumbs-wrapper > .thumbs`]: {
    display: 'flex',
    justifyContent: 'center',
  },
});

interface Props {
  topRatedProducts: IFProduct[];
  featuredProducts: IFProduct[];
}

// https://github.com/yannickcr/eslint-plugin-react/issues/2353
const Home: NextPage<Props> = ({ topRatedProducts, featuredProducts }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { loadingAddToCart, alertAddToCart, setAlertAddToCart, addToCartHandler } = useAddToCartHandler();

  const onCarouselImgClickHandler = (e: React.SyntheticEvent<Element, Event>, productSlug: string): void => {
    e.preventDefault();
    router.push(`/product/${productSlug}`);
  };

  return (
    <Layout>
      <Box pt={2}>
        <StyledCarousel /* infiniteLoop */ useKeyboardArrows autoPlay className={`${PREFIX}-carousel`}>
          {featuredProducts.map((product) => (
            <a
              key={product._id}
              href={`/product/${product.slug}`}
              onClick={(e): void => onCarouselImgClickHandler(e, product.slug)}
              style={{
                display: 'block',
                height: '100%',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.featuredImage} alt={product.name} title={product.name} />
              <Box
                component="p"
                className="legend"
                sx={{
                  '&.legend': {
                    display: 'none',
                    [theme.breakpoints.up(540)]: {
                      display: 'block',
                    },
                  },
                }}
              >
                {product.name}
              </Box>
            </a>
          ))}
        </StyledCarousel>
        {/* <h1 style={{ color: theme.palette.primary.main }}>Products</h1> */}
        <Typography variant="h2">Popular Products</Typography>
        <Grid container spacing={3}>
          {topRatedProducts.map((p) => (
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
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await db.connect();
  const topRatedProductsDocs = (await Product.find({}, '-reviews').lean().sort({ rating: -1 }).limit(6)) as IFProduct[];
  topRatedProductsDocs.forEach(db.convertDocToObj);

  const featuredProductsDocs = (await Product.find({ isFeatured: 1 }, '-reviews').lean().limit(3)) as IFProduct[];
  featuredProductsDocs.forEach(db.convertDocToObj);

  await db.disconnect();
  return {
    props: {
      topRatedProducts: topRatedProductsDocs,
      featuredProducts: featuredProductsDocs,
    },
  };
};

export default Home;
