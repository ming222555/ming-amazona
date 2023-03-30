import React, { useState } from 'react';
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
import DialogInfo from './dialogs/DialogInfo';

interface IFProductItemProps {
  product: IFProduct;
  loadingAddToCart: boolean;
  addToCartHandler: (product: IFProduct) => void;
}

export default function ProductItem({ product, loadingAddToCart, addToCartHandler }: IFProductItemProps): JSX.Element {
  const [productToShowmore, setProductToShowmore] = useState<IFProduct | null>(null);

  const moreHandler = (product: IFProduct | null): void => {
    setProductToShowmore(product);
    return;
  };

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
          {loadingAddToCart ? null : (
            <Typography
              sx={{
                flexGrow: 1,
                textAlign: 'center',
                fontWeight: 500,
                '.dots3': {
                  cursor: 'pointer',
                  border: '1px solid #FFA500',
                  borderRadius: 100,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 1rem',
                },
              }}
              px={1}
            >
              <span
                className="dots3"
                onClick={(): void => {
                  moreHandler(product);
                }}
              >
                &#x2022;&#x2022;&#x2022;
              </span>
            </Typography>
          )}
        </CardActions>
      </Card>
      {productToShowmore && <DialogInfo onCancel={(): void => setProductToShowmore(null)} info={'helloworld'} />}
    </>
  );
}
