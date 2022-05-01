import React, { useState, useEffect, useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';
import { Bar } from 'react-chartjs-2';

import Layout from '../../components/Layout';
import { IFSalesSummary } from '../../db/rdbms_tbl_cols';
import StateContext from '../../utils/StateContext';
import Link from '../../components/Link';
import { getError } from '../../utils/error/frontend/error';

const PREFIX = 'AdminDashboardPage';

const StyledPresentTabButton = styled(Button)(({ theme }) => ({
  [`&.Mui-disabled.${PREFIX}-present-tab`]: {
    background: theme.palette.secondary.main,
    color: '#000',
  },
}));

const AdminDashboardPage: NextPage = () => {
  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [summary, setSummary] = useState<IFSalesSummary | null>(null);
  const router = useRouter();

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      router.push('/login?redirect=/admin/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (userInfo.token) {
      if (userInfo.isAdmin) {
        const fetchsummary = async (): Promise<void> => {
          try {
            const { data } = await axios.get<IFSalesSummary>('/api/admin/summary', {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            setSummary(data);
          } catch (err: unknown) {
            setAlert({
              open: true,
              message: getError(err),
              backgroundColor: '#FF3232',
            });
          }
        };
        fetchsummary();
      } else {
        router.push('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.token]);

  return (
    <Layout title="Admin">
      <Typography variant="h1">Admin</Typography>
      {summary ? (
        <>
          <StyledPresentTabButton
            variant="contained"
            size="medium"
            style={{ borderRadius: 0, marginRight: 4 }}
            disabled
            classes={{ disabled: `${PREFIX}-present-tab` }}
          >
            Dashboard
          </StyledPresentTabButton>
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
          <Link href="/admin/products" style={{ marginRight: 4 }}>
            <Button
              variant="contained"
              disableRipple
              disableElevation
              size="medium"
              color="primary"
              style={{ borderRadius: 0 }}
            >
              Products
            </Button>
          </Link>
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
          <Card style={{ borderRadius: 0 }}>
            <List>
              <ListItem>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={3}>
                    <Card raised>
                      <CardContent>
                        <Typography component="p" variant="h1">
                          ${summary.ordersPrice.toFixed(2)}
                        </Typography>
                        <Typography>Sales</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/admin/orders">
                          <Button size="small" color="secondary">
                            View Sales
                          </Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card raised>
                      <CardContent>
                        <Typography component="p" variant="h1">
                          {summary.ordersCount}
                        </Typography>
                        <Typography>Orders</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/admin/orders">
                          <Button size="small" color="secondary">
                            View Orders
                          </Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card raised>
                      <CardContent>
                        <Typography component="p" variant="h1">
                          {summary.productsCount}
                        </Typography>
                        <Typography>Products</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/admin/products">
                          <Button size="small" color="secondary">
                            View Products
                          </Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card raised>
                      <CardContent>
                        <Typography component="p" variant="h1">
                          {summary.usersCount}
                        </Typography>
                        <Typography>Users</Typography>
                      </CardContent>
                      <CardActions>
                        <Link href="/admin/users">
                          <Button size="small" color="secondary">
                            View Users
                          </Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Typography component="h2" variant="h1">
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x._id),
                    datasets: [
                      {
                        label: 'Sales',
                        backgroundColor: 'rgba(162,222,208,1)',
                        data: summary.salesData.map((x) => x.totalSales),
                      },
                    ],
                  }}
                  type
                  options={{
                    legend: { display: true, position: 'right' },
                  }}
                />
              </ListItem>
            </List>
          </Card>
          <Snackbar
            open={alert.open}
            message={alert.message}
            ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={(): void => setAlert({ ...alert, open: false })}
            autoHideDuration={4000}
          />
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
              <Grid container spacing={5}>
                <Grid item xs={12} md={3}>
                  <Card raised>
                    <CardContent>
                      <Typography component="p" variant="h1">
                        <Skeleton variant="rectangular" height="3rem" width="100%" />
                      </Typography>
                      <Typography>Sales</Typography>
                    </CardContent>
                    <CardActions>
                      <Skeleton variant="rectangular" height="1rem" width="100%" />
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card raised>
                    <CardContent>
                      <Typography component="p" variant="h1">
                        <Skeleton variant="rectangular" height="3rem" width="100%" />
                      </Typography>
                      <Typography>Orders</Typography>
                    </CardContent>
                    <CardActions>
                      <Skeleton variant="rectangular" height="1rem" width="100%" />
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card raised>
                    <CardContent>
                      <Typography component="p" variant="h1">
                        <Skeleton variant="rectangular" height="3rem" width="100%" />
                      </Typography>
                      <Typography>Products</Typography>
                    </CardContent>
                    <CardActions>
                      <Skeleton variant="rectangular" height="1rem" width="100%" />
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card raised>
                    <CardContent>
                      <Typography component="p" variant="h1">
                        <Skeleton variant="rectangular" height="3rem" width="100%" />
                      </Typography>
                      <Typography>Users</Typography>
                    </CardContent>
                    <CardActions>
                      <Skeleton variant="rectangular" height="1rem" width="100%" />
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </Card>
      )}
    </Layout>
  );
};

export default AdminDashboardPage;
