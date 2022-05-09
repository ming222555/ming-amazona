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
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import Rating from '@mui/material/Rating';
import Pagination from '@mui/material/Pagination';

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

const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
];
const MAX_RATING = 5;
const ratings = [MAX_RATING, 4, 3, 2, 1];

const fontSize1rem = { fontSize: '1rem' };

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
    searchQuery?: string;
    price?: string;
    rating?: string;
  }

  const filterSearch = ({ page, category, brand, sort, searchQuery, price, rating }: FilterProps): void => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.query = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;

    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e: SelectChangeEvent<string>): void => {
    filterSearch({ category: e.target.value });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageHandler = (e: any, page: any): void => {
    // eslint-disable-next-line no-console
    console.log('pageeeee', page);
    filterSearch({ page });
  };

  const brandHandler = (e: SelectChangeEvent<string>): void => {
    filterSearch({ brand: e.target.value });
  };

  const sortHandler = (e: SelectChangeEvent<string>): void => {
    filterSearch({ sort: e.target.value });
  };

  const priceHandler = (e: SelectChangeEvent<string>): void => {
    filterSearch({ price: e.target.value });
  };

  const ratingHandler = (e: SelectChangeEvent<string>): void => {
    filterSearch({ rating: e.target.value });
  };

  const hasSearchCriteria: boolean =
    (query !== 'all' && query !== '') || category !== 'all' || brand !== 'all' || rating !== 'all' || price !== 'all';

  return (
    <Layout title="Search">
      <Grid container spacing={1} mt={1}>
        <Grid item md={3}>
          <List>
            <ListItem style={{ flexWrap: 'wrap' }}>
              <Typography>Categories</Typography>
              <Select
                fullWidth
                variant="standard"
                value={category as string}
                onChange={categoryHandler}
                style={fontSize1rem}
              >
                <MenuItem style={fontSize1rem} value="all">
                  All
                </MenuItem>
                {categories &&
                  categories.map((category) => (
                    <MenuItem style={fontSize1rem} key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </ListItem>
            <ListItem style={{ flexWrap: 'wrap' }}>
              <Typography>Brands</Typography>
              <Select fullWidth variant="standard" value={brand as string} onChange={brandHandler} style={fontSize1rem}>
                <MenuItem style={fontSize1rem} value="all">
                  All
                </MenuItem>
                {brands &&
                  brands.map((brand) => (
                    <MenuItem style={fontSize1rem} key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
              </Select>
            </ListItem>
            <ListItem style={{ flexWrap: 'wrap' }}>
              <Typography>Prices</Typography>
              <Select fullWidth variant="standard" value={price as string} onChange={priceHandler} style={fontSize1rem}>
                <MenuItem style={fontSize1rem} value="all">
                  All
                </MenuItem>
                {prices &&
                  prices.map((price) => (
                    <MenuItem style={fontSize1rem} key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
              </Select>
            </ListItem>
            <ListItem style={{ flexWrap: 'wrap' }}>
              <Typography>Ratings</Typography>
              <Select
                fullWidth
                variant="standard"
                value={rating as string}
                onChange={ratingHandler}
                style={fontSize1rem}
              >
                <MenuItem style={fontSize1rem} value="all">
                  &nbsp;
                </MenuItem>
                {ratings &&
                  ratings.map((rating, i) => (
                    <MenuItem key={rating} value={rating} style={{ alignItems: 'flex-start' }}>
                      <Rating value={rating} readOnly style={{ verticalAlign: 'middle', fontSize: '1rem' }} />
                      {i > 0 ? (
                        <Typography component="span" style={{ fontSize: '.8rem' }}>
                          &nbsp;&amp; Up
                        </Typography>
                      ) : null}
                    </MenuItem>
                  ))}
              </Select>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9}>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
            {hasSearchCriteria ? (
              <>
                <Typography style={fontSize1rem}>
                  <strong>
                    {products.length === 0
                      ? 'No Results'
                      : products.length > 1
                      ? `${countProducts} Results`
                      : '1 Result'}
                  </strong>
                  {query !== 'all' && query !== '' && ' : ' + query}
                  {category !== 'all' && ' : ' + category}
                  {brand !== 'all' && ' : ' + brand}
                  {price !== 'all' &&
                    ' : Price $' + (price as string).split('-')[0] + ' - $' + (price as string).split('-')[1]}
                  {rating !== 'all' &&
                    ' : Rating ' + rating + `${(rating as string) === MAX_RATING + '' ? '' : ' & up'}`}
                </Typography>
                <IconButton
                  style={{ height: '1rem' }}
                  sx={{ '&:hover': { background: 'transparent' } }}
                  onClick={(): void => {
                    router.push('/search');
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </>
            ) : null}
            {/* <div style={{ paddingLeft: '2rem', marginLeft: 'auto', background: 'lightblue' }}>Sort box</div> */}
            <div style={{ paddingLeft: '2rem', marginLeft: 'auto' }}>
              <Typography style={fontSize1rem}>
                <strong>Sort by</strong>
              </Typography>
              <Select fullWidth variant="standard" value={sort as string} onChange={sortHandler} style={fontSize1rem}>
                <MenuItem style={fontSize1rem} value="featured">
                  Featured
                </MenuItem>
                <MenuItem style={fontSize1rem} value="lowest">
                  Price: Low to High
                </MenuItem>
                <MenuItem style={fontSize1rem} value="highest">
                  Price: High to Low
                </MenuItem>
                <MenuItem style={fontSize1rem} value="toprated">
                  Customer Reviews
                </MenuItem>
                <MenuItem style={fontSize1rem} value="newest">
                  Newest Arrivals
                </MenuItem>
              </Select>
            </div>
          </div>
          <br />
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid item md={4} key={p.name}>
                <ProductItem product={p} loadingAddToCart={loadingAddToCart} addToCartHandler={addToCartHandler} />
              </Grid>
            ))}
          </Grid>
          <Pagination
            sx={{ mt: 1 }}
            defaultPage={parseInt((router.query.page || '1') as string)}
            count={pages}
            onChange={pageHandler}
          />
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
  const sort = (query.sort || 'featured') as string;
  const searchQuery = (query.query || '') as string;

  const queryFilter =
    searchQuery && searchQuery !== 'all' ? { name: { $regex: searchQuery.trim(), $options: 'i' } } : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter = rating && rating !== 'all' ? { rating: { $gte: Number(rating) } } : {};
  // 10-50
  const priceFilter =
    price && price !== 'all' ? { price: { $gte: Number(price.split('-')[0]), $lte: Number(price.split('-')[1]) } } : {};

  const order =
    sort === 'featured'
      ? { isFeatured: -1, _id: -1 }
      : sort === 'lowest'
      ? { price: 1, _id: -1 }
      : sort === 'highest'
      ? { price: -1, _id: -1 }
      : sort === 'toprated'
      ? { rating: -1, _id: -1 }
      : sort === 'newest'
      ? { createdAt: -1, _id: -1 }
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
