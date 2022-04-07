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

import Layout from '../Layout';
import data from '../utils/data';
import Link from '../Link';

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {data.products.map((p) => (
            <Grid item md={4} key={p.name}>
              <Card>
                <Link href={`/product/${p.slug}`} underline="none">
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

export default Home;
