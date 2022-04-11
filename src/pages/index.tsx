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
import data from '../db/seeddata';

const Home: NextPage = () => {
  const theme = useTheme();

  return (
    <Layout>
      <div>
        <h1 style={{ color: theme.palette.primary.main }}>Products</h1>
        <Grid container spacing={3}>
          {data.products.map((p) => (
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

export default Home;
