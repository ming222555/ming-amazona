import React, { useState, useEffect, useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';

import axios from 'axios';

import Link from '../components/Link';
import { getError } from '../utils/error/frontend/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DrawerSearch(props: { open: boolean; closeHandler: () => void }): JSX.Element {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategoryList = useCallback(async (): Promise<void> => {
    try {
      const { data } = await axios.get<string[]>('/api/products/categories');
      setCategories(data);
    } catch (err: unknown) {
      setAlert({
        open: true,
        message: getError(err),
        backgroundColor: '#FF3232',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCategoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = useTheme();

  return (
    <>
      <Drawer anchor="left" open={props.open} onClose={props.closeHandler}>
        <List>
          <ListItem sx={{ '&:hover': { background: 'transparent' } }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography>Shopping by category</Typography>
              <IconButton
                aria-label="open close"
                sx={{ '&:hover': { background: 'transparent' } }}
                onClick={props.closeHandler}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          </ListItem>
          <Divider light />
          {categories.map((category) => (
            <ListItem key={category}>
              <ListItemText>
                <Link
                  href={`/search?category=${category}`}
                  style={{ display: 'flex' }}
                  color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
                >
                  {category}
                </Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={(): void => setAlert({ ...alert, open: false })}
        autoHideDuration={4000}
      />
    </>
  );
}
