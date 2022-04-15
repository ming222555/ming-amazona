import React, { useContext, useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';
import Badge from '@mui/material/Badge';

import Cookies from 'js-cookie';

import Link from '../components/Link';
import StateContext from '../utils/StateContext';
import { IFCartItem } from '../db/rdbms_tbl_cols';

const PREFIX = 'Header';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`&.${PREFIX}-navbar`]: {
    [`& .${PREFIX}-navbar__middle`]: {
      flex: '1 1 auto',
    },
    [`& .${PREFIX}-navbar__tab`]: {
      ...theme.typography.tab,
      marginLeft: 10,
      '&:first-of-type': {
        marginLeft: 0,
      },
    },
  },
}));

function getCartQuantity(total = 0, cartItem: IFCartItem): number {
  return total + cartItem.quantity;
}

export default function Header(): JSX.Element {
  const theme = useTheme();
  const { state, dispatch } = useContext(StateContext);
  const { darkMode, cart } = state;

  const darkModeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked) {
      dispatch({ type: 'DARK_MODE_ON' });
      return;
    }
    dispatch({ type: 'DARK_MODE_OFF' });
  };

  // const [value, setValue] = useState(0);
  // const handleChange = (e: React.SyntheticEvent<Element, Event>, value: number): void => {
  //   setValue(value);
  // };

  const hasMount = useRef(false);

  useEffect(() => {
    if (!hasMount.current) {
      hasMount.current = true;

      const szCookieCartItems = Cookies.get('cartItems');
      const szUserInfo = Cookies.get('userInfo');

      if (szCookieCartItems) {
        dispatch({ type: 'SET_CART_ITEMS', payload: JSON.parse(szCookieCartItems) });
      } else {
        dispatch({ type: 'RESET_CART_ITEMS' });
      }

      if (szUserInfo) {
        dispatch({ type: 'USER_LOGIN', payload: JSON.parse(szUserInfo) });
      } else {
        dispatch({ type: 'RESET_USER_LOGIN' });
      }
    }
  }, [dispatch]);

  return (
    <StyledAppBar position="static" className={`${PREFIX}-navbar`}>
      <Toolbar>
        <Link href="/">
          {/* todo Replace brand typo amazona with svg */}
          <Typography style={{ ...theme.typography.brand }}>amazona</Typography>
        </Link>
        <div className={`${PREFIX}-navbar__middle`}>&nbsp;</div>
        <Switch checked={darkMode} onChange={darkModeChangeHandler}></Switch>
        {/* indicatorColor overriden to transparent at Theme.ts */}
        <Tabs value={0} /* value={value} onChange={handleChange} indicatorColor="secondary" */>
          {/* <Tab component={Link} href="/cart" label="Cart" className={`${PREFIX}-navbar__tab`} disableRipple /> */}
          <Tab
            component={Link}
            href="/cart"
            label={
              <Badge badgeContent={cart.cartItems.reduce(getCartQuantity, 0)} color="secondary">
                Cart
              </Badge>
            }
            className={`${PREFIX}-navbar__tab`}
            disableRipple
          />
          <Tab component={Link} href="/login" label="Login" className={`${PREFIX}-navbar__tab`} disableRipple />
        </Tabs>
      </Toolbar>
    </StyledAppBar>
  );
}
