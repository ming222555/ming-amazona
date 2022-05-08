import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';

import Link from './Link';
import { IFProduct } from '../../db/rdbms_tbl_cols';

interface IFProductItemProps {
  product: IFProduct;
  loadingAddToCart: boolean;
  addToCartHandler: (product: IFProduct) => void;
}

export default function ProductItem({ product, loadingAddToCart, addToCartHandler }: IFProductItemProps): JSX.Element {
  return (
    <>
      <Card>
        <Link href={`/product/${product.slug}`}>
          <CardActionArea>
            <CardMedia component="img" image={product.image} title={product.name} />
            <CardContent>
              <Typography>{product.name}</Typography>
              <Rating value={product.rating} readOnly />
            </CardContent>
          </CardActionArea>
        </Link>
        <CardActions>
          <Typography>${product.price.toFixed(2)}</Typography>
          <Button
            size="small"
            color="primary"
            onClick={(): void => {
              addToCartHandler(product);
            }}
            disabled={loadingAddToCart}
          >
            {loadingAddToCart ? <CircularProgress size={30} /> : 'Add to cart'}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
