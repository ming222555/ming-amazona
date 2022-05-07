import React, { useContext, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';

import Cookies from 'js-cookie';

import Link from '../components/Link';
import StateContext from '../utils/StateContext';
import { IFCartItem } from '../db/rdbms_tbl_cols';
import DrawerSearch from './DrawerSearch';

const PREFIX = 'Header';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`&.${PREFIX}-navbar`]: {
    [`& .${PREFIX}-brand`]: {
      marginRight: 12,
    },
    [`& .${PREFIX}-navbar__middle`]: {
      flex: '1 1 auto',
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
      },
    },
    [`& .${PREFIX}-searchForm`]: {
      margin: 'auto',
      background: '#fff',
      width: '70%',
      maxWidth: 680,
      border: '1px solid #fff',
      borderRadius: 5,
    },
    [`& .${PREFIX}-searchInput`]: {
      paddingLeft: 5,
      color: '#000',
      '& ::placeholder': {
        color: '#606060',
      },
    },
    [`& .${PREFIX}-searchButton`]: {
      background: '#f8c040',
      padding: 5,
      borderRadius: '0 5px 5px 0',
    },
    [`& .${PREFIX}-darkModeSwitch`]: {
      marginLeft: 'auto',
    },
    [`& .${PREFIX}-navbar__tab`]: {
      ...theme.typography.tab,
      padding: '0.5rem',
      marginLeft: 5,
      // '&:first-of-type': {
      //   marginLeft: 0,
      // },
    },
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: `${theme.palette.mode !== 'dark' ? theme.palette.common.blue : '#121212'}`, // from Chrome inspector...
    backgroundImage: `${
      theme.palette.mode !== 'dark' ? 'none' : 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))'
    }`,
    borderRadius: 0,
    borderWidth: 0,
    marginTop: 4,
  },
}));

function getCartQuantity(total = 0, cartItem: IFCartItem): number {
  return total + cartItem.quantity;
}

export default function Header(): JSX.Element {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const router = useRouter();
  const { state, dispatch } = useContext(StateContext);
  const { darkMode, cart, userInfo } = state;

  const { token, name } = userInfo;

  const darkModeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked) {
      dispatch({ type: 'DARK_MODE_ON' });
      return;
    }
    dispatch({ type: 'DARK_MODE_OFF' });
  };

  const loginMenuCloseHandler = (): void => {
    setAnchorEl(null);
  };

  const loginMenuCloseHandlerWithGoto = (e: React.SyntheticEvent<Element, Event>, goto: string): void => {
    e.preventDefault();
    loginMenuCloseHandler();
    router.push(goto);
  };

  const logoutClickHandler = (e: React.SyntheticEvent<Element, Event>): void => {
    e.preventDefault();
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    router.push('/');
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
      }

      if (szUserInfo) {
        dispatch({ type: 'USER_LOGIN', payload: JSON.parse(szUserInfo) });
      }
    }
  }, [dispatch]);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = (): void => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = (): void => {
    setSidebarVisible(false);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const searchQueryHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };
  const submitSearchHandler = (e: React.SyntheticEvent<Element, Event>): void => {
    e.preventDefault();
    router.push(`/search?query=${searchQuery}`);
  };

  return (
    <StyledAppBar position="static" className={`${PREFIX}-navbar`}>
      <Toolbar>
        <DrawerSearch open={sidebarVisible} closeHandler={sidebarCloseHandler} />
        <IconButton
          edge="start"
          aria-label="open drawer"
          disableRipple
          sx={{ '&:hover': { background: 'transparent' } }}
          onClick={sidebarOpenHandler}
        >
          <MenuIcon />
        </IconButton>
        <Link href="/" className={`${PREFIX}-brand`}>
          <Typography style={{ ...theme.typography.brand }}>amazona</Typography>
        </Link>
        <div className={`${PREFIX}-navbar__middle`}>
          <form className={`${PREFIX}-searchForm`} onSubmit={submitSearchHandler}>
            {/* <TextField value="33333" style={{ background: 'blue' }} fullWidth /> */}
            <InputBase
              name="query"
              className={`${PREFIX}-searchInput`}
              placeholder="Search Products"
              onChange={searchQueryHandler}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton type="submit" aria-label="search" className={`${PREFIX}-searchButton`}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
          </form>
        </div>
        <Switch checked={darkMode} onChange={darkModeChangeHandler} className={`${PREFIX}-darkModeSwitch`}></Switch>
        {/* indicatorColor overriden to transparent at Theme.ts */}
        <Tabs
          value={0}
          /* value={value} onChange={handleChange} indicatorColor="secondary" */
        >
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
          <Tab
            component={Link}
            href={token ? '#' : '/login'}
            label={
              token ? (
                <span style={{ maxWidth: '10rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {name}
                </span>
              ) : (
                'Login'
              )
            }
            aria-owns={token ? 'username-menu' : undefined}
            aria-haspopup={token ? true : undefined}
            iconPosition={token ? 'end' : undefined}
            icon={
              !token ? undefined : anchorEl ? (
                <KeyboardArrowUpIcon style={{ margin: 0 }} />
              ) : (
                <KeyboardArrowDownIcon style={{ margin: 0 }} />
              )
            }
            onClick={
              token
                ? (e: React.MouseEvent): void => {
                    setAnchorEl(e.currentTarget);
                  }
                : undefined
            }
            className={`${PREFIX}-navbar__tab`}
            style={{ opacity: token ? 1 : undefined }}
            disableRipple
          />
        </Tabs>
        <StyledMenu
          id="username-menu"
          anchorEl={anchorEl as HTMLElement}
          open={Boolean(anchorEl)}
          onClose={loginMenuCloseHandler}
          elevation={0}
          style={{ zIndex: 1302, marginTop: '-1.8rem' }}
          // anchorOrigin={{
          //   vertical: 'bottom',
          //   horizontal: 'right',
          // }}
          // transformOrigin={{
          //   vertical: 'top',
          //   horizontal: 'right',
          // }}
          keepMounted
        >
          <MenuItem
            component={Link}
            href="/profile"
            onClick={(e: React.SyntheticEvent<Element, Event>): void => loginMenuCloseHandlerWithGoto(e, '/profile')}
            style={{
              ...theme.typography.tab,
            }}
            disableRipple
          >
            Profile
          </MenuItem>
          <MenuItem
            component={Link}
            href="/order-history"
            onClick={(e: React.SyntheticEvent<Element, Event>): void =>
              loginMenuCloseHandlerWithGoto(e, '/order-history')
            }
            style={{
              ...theme.typography.tab,
            }}
            disableRipple
          >
            Order History
          </MenuItem>
          {userInfo.token && userInfo.isAdmin ? (
            <MenuItem
              component={Link}
              href="/admin/dashboard"
              onClick={(e: React.SyntheticEvent<Element, Event>): void =>
                loginMenuCloseHandlerWithGoto(e, '/admin/dashboard')
              }
              style={{
                ...theme.typography.tab,
              }}
              disableRipple
            >
              Admin Dashboard
            </MenuItem>
          ) : null}
          <MenuItem
            component={Link}
            href="/"
            onClick={logoutClickHandler}
            style={{
              ...theme.typography.tab,
            }}
            disableRipple
          >
            Logout
          </MenuItem>
        </StyledMenu>
      </Toolbar>
    </StyledAppBar>
  );
}
