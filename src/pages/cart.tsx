import React, { useContext } from 'react';
import type { NextPage } from 'next';
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

import axios from 'axios';

import StateContext from '../utils/StateContext';
import Link from '../components/Link';
import Layout from '../components/Layout';
import { IFProduct, IFCartItem } from '../db/rdbms_tbl_cols';

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
  const { state, dispatch } = useContext(StateContext);
  const {
    cart: { cartItems },
  } = state;

  async function updateCartHandler(item: IFCartItem, quantity: number): Promise<void> {
    const { data } = await axios.get<IFProduct>(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  }

  function removeItemHandler(id: string): void {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  }

  return (
    <Layout title="Shopping Cart">
      <Typography variant="h1">Shopping Cart</Typography>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>{' '}
        </div>
      ) : (
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
                        >
                          {numList(item.countInStock)}
                        </Select>
                      </TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(): void => removeItemHandler(item._id)}>
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
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button variant="contained" color="secondary" fullWidth>
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default CartPage;
