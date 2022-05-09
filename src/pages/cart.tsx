import React, { useContext, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

import axios from 'axios';

import StateContext from '../utils/StateContext';
import Link from '../components/shared/Link';
import Layout from '../components/Layout';
import { IFProduct, IFCartItem } from '../db/rdbms_tbl_cols';
import { getError } from '../utils/error/frontend/error';

function numList(num: number): JSX.Element[] {
  const jsxArry: JSX.Element[] = [];
  for (let i = 0; i < num; i++) {
    jsxArry.push(
      <MenuItem key={i + 1} value={i + 1}>
        {i + 1}
      </MenuItem>,
    );
  }
  return jsxArry;
}

const CartPage: NextPage = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(StateContext);
  const {
    cart: { cartItems },
  } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [loading, setLoading] = useState(false);

  async function updateCartHandler(item: IFCartItem, quantity: number): Promise<void> {
    try {
      setLoading(true);
      const { data } = await axios.get<IFProduct>(`/api/products/${item._id}`);
      setLoading(false);
      if (data.countInStock < quantity) {
        setAlert({
          open: true,
          message: 'Sorry. Product is out of stock',
          backgroundColor: '#FF3232',
        });
        return;
      }
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    } catch (err: unknown) {
      setLoading(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  }

  function removeItemHandler(id: string): void {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  }

  function checkoutHandler(): void {
    router.push('/shipping');
  }

  return (
    <Layout title="Shopping Cart">
      <Typography variant="h1">Shopping Cart</Typography>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <>
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Link href={`/product/${item.slug}`}>
                            <Image src={item.image} alt={item.name} width={50} height={50} />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/product/${item.slug}`}>
                            <Typography color="secondary">{item.name}</Typography>
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          <Select
                            value={item.quantity}
                            onChange={(e): void => {
                              updateCartHandler(item, e.target.value as number);
                            }}
                            disabled={loading}
                          >
                            {numList(item.countInStock)}
                          </Select>
                        </TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(): void => removeItemHandler(item._id)} disabled={loading}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                      {cartItems.reduce((a, c) => a + c.quantity * c.price, 0).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button
                      onClick={checkoutHandler}
                      variant="contained"
                      color="secondary"
                      fullWidth
                      disabled={loading}
                    >
                      Check Out
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
          <Snackbar
            open={alert.open}
            message={alert.message}
            ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={(): void => setAlert({ ...alert, open: false })}
            autoHideDuration={4000}
          />
        </>
      )}
    </Layout>
  );
};

export default CartPage;
