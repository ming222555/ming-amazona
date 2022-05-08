import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import { SelectChangeEvent } from '@mui/material';

import Layout from '../components/Layout';
import Product from '../db/models/Product';
import db from '../db/db';
import { IFProduct } from '../db/rdbms_tbl_cols';
import ProductItem from '../components/shared/ProductItem';
import useAddToCartHandler from '../hooks/shared/useAddToCartHandler';

const PAGE_SIZE = '3';

interface Props {
  products: IFProduct[];
  countProducts: number;
  categories: string[];
  brands: string[];
  pages: number;
}

const SearchPage: NextPage<Props> = ({ products, countProducts, categories, brands, pages }: Props) => {
  const router = useRouter();
  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;

  const { loadingAddToCart, alertAddToCart, setAlertAddToCart, addToCartHandler } = useAddToCartHandler();

  interface FilterProps {
    page?: string;
    category?: string;
    brand?: string;
    sort?: string;
    min?: number;
    max?: number;
    searchQuery?: string;
    price?: string;
    rating?: string;
  }

  const filterSearch = ({ page, category, brand, sort, min, max, searchQuery, price, rating }: FilterProps): void => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.query = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    /////////////// if (min) query.min =

    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e: SelectChangeEvent<string>): void => {
    filterSearch({ category: e.target.value });
  };

  return (
    <Layout title="Search">
      <Grid container spacing={1} mt={1}>
        <Grid item md={3}>
          <List>
            <ListItem style={{ flexWrap: 'wrap' }}>
              <Typography>Categories</Typography>
              <Select fullWidth variant="standard" value={category as string} onChange={categoryHandler}>
                <MenuItem value="all">All</MenuItem>
                {categories &&
                  categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9}>
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid item md={4} key={p.name}>
                <ProductItem product={p} loadingAddToCart={loadingAddToCart} addToCartHandler={addToCartHandler} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={alertAddToCart.open}
        message={alertAddToCart.message}
        ContentProps={{ style: { backgroundColor: alertAddToCart.backgroundColor } }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={(): void => setAlertAddToCart({ ...alertAddToCart, open: false })}
        autoHideDuration={4000}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const query = context.query;

  const szPageSize = (query.pageSize || PAGE_SIZE) as string;
  const pageSize = Number(szPageSize);

  const szPage = (query.page || '1') as string;
  const page = Number(szPage);

  const category = (query.category || '') as string;
  const brand = (query.brand || '') as string;
  const price = (query.price || '') as string;
  const rating = (query.rating || '') as string;
  const sort = (query.sort || '') as string;
  const searchQuery = (query.query || '') as string;

  const queryFilter = searchQuery && searchQuery !== 'all' ? { name: { $regex: searchQuery, $options: 'i' } } : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter = rating && rating !== 'all' ? { rating: { $gte: Number(rating) } } : {};
  // 10-50
  const priceFilter =
    price && price !== 'all' ? { price: { $gte: Number(price.split('-')[0]), $lte: Number(price.split('-')[1]) } } : {};

  const order =
    sort === 'featured'
      ? { feature: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  await db.connect();
  const categories = await Product.find().distinct('category');
  const brands = await Product.find().distinct('brand');
  const productDocs = await Product.find(
    { ...queryFilter, ...categoryFilter, ...priceFilter, ...brandFilter, ...ratingFilter },
    '-reviews',
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });

  await db.disconnect();

  productDocs.forEach(db.convertDocToObj);

  return {
    props: {
      products: productDocs as IFProduct[],
      countProducts,
      categories,
      brands,
      pages: Math.ceil(countProducts / pageSize),
    },
  };
};

export default SearchPage;
