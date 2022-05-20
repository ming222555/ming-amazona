import React, { useState, useEffect, useContext } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';

import Layout from '../../../components/Layout';
import { IFProduct } from '../../../db/rdbms_tbl_cols';
import StateContext from '../../../utils/StateContext';
import Link from '../../../components/shared/Link';
import { getError } from '../../../utils/error/frontend/error';
import demo from '../../../demo';

const PREFIX = 'ProductEditPage';

const StyledForm = styled('form')({
  [`&.${PREFIX}-form`]: {
    maxWidth: 800,
    margin: 'auto',
  },
});

interface IFFormData {
  name: string;
  slug: string;
  price: number;
  image: string;
  featuredImage: string;
  category: string;
  brand: string;
  countInStock: number;
  description: string;
}

interface Props {
  id: string;
}

const ProductEditPage: NextPage<Props> = ({ id }: Props) => {
  // https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFFormData>();

  const { state } = useContext(StateContext);
  const { userInfo } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingUploadFeatured, setLoadingUploadFeatured] = useState(false);

  const [product, setProduct] = useState<IFProduct | null>(null);
  const router = useRouter();

  const [isFeatured, setIsFeatured] = useState(0);

  const uploadHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageField: 'image' | 'featuredImage',
  ): Promise<void> => {
    const file = e.target && e.target.files && e.target.files[0];
    const tmp: unknown = file;
    const fileBlobString = tmp as string;
    const bodyFormData = new FormData();
    bodyFormData.append('file', fileBlobString);
    if (demo) {
      setAlert({
        open: true,
        message: `Website for demo only. Upload Image not allowed.`,
        backgroundColor: '#FF3232',
      });
      return;
    }

    try {
      imageField === 'image' ? setLoadingUpload(true) : setLoadingUploadFeatured(true);
      const { data } = await axios.post(`/api/admin/upload`, bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data', authorization: `Bearer ${userInfo.token}` },
      });
      imageField === 'image' ? setLoadingUpload(false) : setLoadingUploadFeatured(false);
      setValue(imageField, data.secure_url);
      setAlert({
        open: true,
        message: 'Image uploaded successfully',
        backgroundColor: '#4BB543',
      });
    } catch (err: unknown) {
      imageField === 'image' ? setLoadingUpload(false) : setLoadingUploadFeatured(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    image,
    featuredImage,
    category,
    brand,
    countInStock,
    description,
  }: IFFormData): Promise<void> => {
    if (demo) {
      setAlert({
        open: true,
        message: `Website for demo only. Update of product not allowed.`,
        backgroundColor: '#FF3232',
      });
      return;
    }

    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.put<{ message: string }>(
        `/api/admin/products/${id}`,
        { ...product, name, slug, price, image, isFeatured, featuredImage, category, brand, countInStock, description },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );
      setLoading(false);
      setAlert({
        open: true,
        message: 'Product updated successfully',
        backgroundColor: '#4BB543',
      });
    } catch (err: unknown) {
      setLoading(false);
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
  };

  useEffect((): void => {
    const szUserInfo = Cookies.get('userInfo');

    if (!szUserInfo) {
      router.push(`/login?redirect=/admin/product/${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (userInfo.token) {
      if (userInfo.isAdmin) {
        const fetchproduct = async (): Promise<void> => {
          try {
            const { data } = await axios.get<IFProduct>(`/api/admin/products/${id}`, {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            setValue('name', data.name);
            setValue('slug', data.slug);
            setValue('price', data.price);
            setValue('image', data.image);
            setValue('featuredImage', data.featuredImage);
            setIsFeatured(data.isFeatured);
            setValue('category', data.category);
            setValue('brand', data.brand);
            setValue('countInStock', data.countInStock);
            setValue('description', data.description);

            setProduct(data);
          } catch (err: unknown) {
            setAlert({
              open: true,
              message: getError(err),
              backgroundColor: '#FF3232',
            });
          }
        };
        fetchproduct();
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
    </>
  );

  return (
    <Layout title="Edit Product">
      <Typography variant="h1">Edit Product {id}</Typography>
      {product ? (
        <>
          {tabs}
          <Card style={{ borderRadius: 0 }}>
            <List>
              <ListItem>
                <StyledForm
                  className={`${PREFIX}-form`}
                  onSubmit={handleSubmit(submitHandler)}
                  style={{ width: '100%' }}
                >
                  <fieldset
                    style={{ margin: 0, padding: 0, border: 'transparent' }}
                    disabled={loading || loadingUpload || loadingUploadFeatured}
                  >
                    <List>
                      <ListItem>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="name"
                              label="Name"
                              error={Boolean(errors.name)}
                              helperText={errors.name ? 'Name is required' : ''}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="slug"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="slug"
                              label="Slug"
                              error={Boolean(errors.slug)}
                              helperText={errors.slug ? 'Slug is required' : ''}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="price"
                          control={control}
                          defaultValue={0}
                          rules={{
                            required: {
                              value: true,
                              message: 'Price is required',
                            },
                            pattern: {
                              value: /^[0-9]+(.[0-9]{1,2})?$/,
                              message: 'Price must be numeric (at most 2 dp)',
                            },
                          }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="price"
                              label="Price"
                              error={Boolean(errors.price)}
                              helperText={errors.price?.message}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="image"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="image"
                              label="Image"
                              error={Boolean(errors.image)}
                              helperText={errors.image ? 'Image is required' : ''}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          component="label"
                          color="secondary"
                          disabled={loading || loadingUpload || loadingUploadFeatured}
                        >
                          {loadingUpload ? <CircularProgress size={30} /> : 'Upload Image'}
                          <input
                            type="file"
                            onChange={(e): void => {
                              uploadHandler(e, 'image');
                            }}
                            hidden
                          />
                        </Button>
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          label={<span style={{ fontSize: '1rem' }}>Is Featured</span>}
                          control={
                            <Checkbox
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onClick={(e: any): void => {
                                setIsFeatured(e.target.checked ? 1 : 0);
                              }}
                              checked={isFeatured ? true : false}
                              name="isFeatured"
                              size="small"
                            />
                          }
                          style={{ marginTop: '1rem' }}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="featuredImage"
                          control={control}
                          defaultValue=""
                          rules={{ required: isFeatured ? true : false }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="featuredImage"
                              label="Featured Image"
                              error={Boolean(errors.featuredImage)}
                              helperText={errors.featuredImage ? 'Featured Image is required' : ''}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          component="label"
                          color="secondary"
                          disabled={loading || loadingUpload || loadingUploadFeatured}
                          style={{ marginBottom: '1rem' }}
                        >
                          {loadingUploadFeatured ? <CircularProgress size={30} /> : 'Upload Image'}
                          <input
                            type="file"
                            onChange={(e): void => {
                              uploadHandler(e, 'featuredImage');
                            }}
                            hidden
                          />
                        </Button>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="category"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="category"
                              label="Category"
                              error={Boolean(errors.category)}
                              helperText={errors.category ? 'Category is required' : ''}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="brand"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="brand"
                              label="Brand"
                              error={Boolean(errors.brand)}
                              helperText={errors.brand ? 'Brand is required' : ''}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="countInStock"
                          control={control}
                          defaultValue={0}
                          rules={{
                            required: {
                              value: true,
                              message: 'Count in stock is required',
                            },
                            pattern: {
                              value: new RegExp('^(100000|\\d{1,5})$'),
                              message: 'Count in stock must be integer (0 or more) of maximum 100000',
                            },
                          }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="countInStock"
                              label="Count in stock"
                              error={Boolean(errors.countInStock)}
                              helperText={errors.countInStock?.message}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="description"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }): JSX.Element => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              id="description"
                              label="Description"
                              error={Boolean(errors.description)}
                              helperText={errors.description ? 'Description is required' : ''}
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={loading || loadingUpload || loadingUploadFeatured}
                          fullWidth
                        >
                          {loading ? <CircularProgress size={30} /> : 'Update'}
                        </Button>
                      </ListItem>
                    </List>
                  </fieldset>
                </StyledForm>
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
              if (alert.message === 'Product updated successfully') {
                router.push('/admin/products');
              }
            }}
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
        <StyledForm className={`${PREFIX}-form`}>
          <fieldset style={{ margin: 0, padding: 0, border: 'transparent' }}>
            <List>
              <ListItem>
                <Skeleton variant="rectangular" height="4rem" width="100%" />
              </ListItem>
              <ListItem>
                <Skeleton variant="rectangular" height="4rem" width="100%" />
              </ListItem>
              <ListItem>
                <Skeleton variant="rectangular" height="4rem" width="100%" />
              </ListItem>
              <ListItem>
                <Skeleton variant="rectangular" height="4rem" width="100%" />
              </ListItem>
              <ListItem>
                <Button variant="contained" color="primary" fullWidth disabled>
                  Update
                </Button>
              </ListItem>
            </List>
          </fieldset>
        </StyledForm>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const id = context.params?.id as string;

  return {
    props: {
      id,
    },
  };
};

export default ProductEditPage;
