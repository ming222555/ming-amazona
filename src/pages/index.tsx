import React from 'react';
import type { NextPage } from 'next';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import Link from '../components/Link';
import Layout from '../components/Layout';
import db from '../db/db';
import Product from '../db/models/Product';
import { IFProduct } from '../db/rdbms_tbl_cols';

interface Props {
  products: IFProduct[];
}

// https://github.com/yannickcr/eslint-plugin-react/issues/2353
const Home: NextPage<Props> = ({ products }: Props) => {
  const theme = useTheme();

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
                    </CardContent>
                  </CardActionArea>
                </Link>
                <CardActions>
                  <Typography>${p.price}</Typography>
                  <Button size="small" color="primary">
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(): Promise<{ props: Props }> {
  await db.connect();
  const products = (await Product.find({}).lean()) as IFProduct[];
  products.forEach(db.convertDocToObj);
  await db.disconnect();
  return {
    props: {
      products,
    },
  };
}

export default Home;
