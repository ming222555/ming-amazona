import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';

import Layout from '../../components/Layout';
import { IFProduct } from '../../db/rdbms_tbl_cols';
import StateContext from '../../utils/StateContext';
import Link from '../../components/shared/Link';
import { getError } from '../../utils/error/frontend/error';
import StyledCard from '../../components/shared/StyledCard';

const PREFIX = 'AdminProductsPage';

const StyledPresentTabButton = styled(Button)(({ theme }) => ({
  [`&.Mui-disabled.${PREFIX}-present-tab`]: {
    background: theme.palette.secondary.main,
    color: '#000',
  },
}));

const AdminProductsPage: NextPage = () => {
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [productList, setProductList] = useState<IFProduct[] | null>(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const router = useRouter();

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      router.push('/login?redirect=/admin/products');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchproductList = useCallback(async (): Promise<void> => {
    try {
      const { data } = await axios.get<IFProduct[]>('/api/admin/products', {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setProductList(data);
    } catch (err: unknown) {
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (userInfo.token) {
      if (userInfo.isAdmin) {
        fetchproductList();
      } else {
        router.push('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.token]);

  const tabs: React.ReactNode = (
    <>
      <Link href="/admin/dashboard" style={{ marginRight: 4 }}>
        <Button
          variant="contained"
          disableRipple
          disableElevation
          size="medium"
          color="primary"
          style={{ borderRadius: 0 }}
        >
          Dashboard
        </Button>
      </Link>
      <Link href="/admin/orders" style={{ marginRight: 4 }}>
        <Button
          variant="contained"
          disableRipple
          disableElevation
          size="medium"
          color="primary"
          style={{ borderRadius: 0 }}
        >
          Orders
        </Button>
      </Link>
      <StyledPresentTabButton
        variant="contained"
        size="medium"
        style={{ borderRadius: 0, marginRight: 4 }}
        disabled
        classes={{ disabled: `${PREFIX}-present-tab` }}
      >
        Products
      </StyledPresentTabButton>
      <Link href="/admin/users">
        <Button
          variant="contained"
          disableRipple
          disableElevation
          size="medium"
          color="primary"
          style={{ borderRadius: 0 }}
        >
          Users
        </Button>
      </Link>
    </>
  );

  const createdId = useRef('');

  const createHandler = async (): Promise<void> => {
    try {
      setLoadingCreate(true);
      const { data } = await axios.post<{ _id: string }>(
        `/api/admin/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );
      setLoadingCreate(false);
      createdId.current = data._id;
      setAlert({
        open: true,
        message: 'Product created successfully',
        backgroundColor: '#4BB543',
      });
    } catch (err: unknown) {
      setLoadingCreate(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  const deletedProduct = useRef<true | null>(null);

  const deleteHandler = async (productId: string): Promise<void> => {
    try {
      setLoadingDelete(true);
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setLoadingDelete(false);
      deletedProduct.current = true;
      setAlert({
        open: true,
        message: 'Product deleted successfully',
        backgroundColor: '#4BB543',
      });
    } catch (err: unknown) {
      setLoadingDelete(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  useEffect((): void => {
    if (deletedProduct.current) {
      if (userInfo.token) {
        if (userInfo.isAdmin) {
          deletedProduct.current = null; // reset
          fetchproductList();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedProduct.current]);

  return (
    <Layout title="Admin">
      <Typography variant="h1">Admin</Typography>
      {productList && productList.length > 0 ? (
        <>
          {tabs}
          <Card style={{ borderRadius: 0 }}>
            <List>
              <ListItem>
                <StyledCard>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              disabled={loadingCreate || loadingDelete}
                              onClick={createHandler}
                            >
                              {loadingCreate ? <CircularProgress size={30} /> : 'Create'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productList.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>{product._id.substring(20, 24)}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <Link
                                href={`/admin/product/${product._id}`}
                                onClick={(e: React.SyntheticEvent<Element, Event>): void => {
                                  if (loadingCreate || loadingDelete) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <IconButton disabled={loadingCreate || loadingDelete}>
                                  <EditIcon />
                                </IconButton>
                              </Link>
                              <IconButton
                                disabled={loadingCreate || loadingDelete}
                                onClick={(): void => {
                                  deleteHandler(product._id);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </StyledCard>
              </ListItem>
            </List>
          </Card>
          <Snackbar
            open={alert.open}
            message={alert.message}
            ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={(): void => {
              setAlert({ ...alert, open: false });
              if (alert.message === 'Product created successfully') {
                router.push('/admin/product/' + createdId.current);
              }
            }}
            autoHideDuration={4000}
          />
        </>
      ) : productList && productList.length === 0 ? (
        <>
          {tabs}
          <Card style={{ borderRadius: 0 }}>
            <List>
              <ListItem>
                <Typography variant="h2">Products not found</Typography>
              </ListItem>
            </List>
          </Card>
        </>
      ) : alert.message ? (
        <Snackbar
          open={alert.open}
          message={alert.message}
          ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={(): void => setAlert({ ...alert, open: false })}
          autoHideDuration={4000}
        />
      ) : (
        <Card>
          <List>
            <ListItem>
              <StyledCard>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>NAME</TableCell>
                        <TableCell>PRICE</TableCell>
                        <TableCell>CATEGORY</TableCell>
                        <TableCell>COUNT</TableCell>
                        <TableCell>RATING</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width="100%" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledCard>
            </ListItem>
          </List>
        </Card>
      )}
    </Layout>
  );
};

export default AdminProductsPage;
