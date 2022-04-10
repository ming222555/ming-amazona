import React, { useContext /* , { useState } */ } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';

import Link from '../components/Link';
import { StateContext } from '../utils/StateContext';

import Cookies from 'js-cookie';

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

export default function Header(): JSX.Element {
  const theme = useTheme();
  const { state, dispatch } = useContext(StateContext);
  const { darkMode } = state;

  const darkModeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked) {
      dispatch({ type: 'DARK_MODE_ON' });
      Cookies.set('darkMode', 'ON');
      return;
    }
    dispatch({ type: 'DARK_MODE_OFF' });
    Cookies.set('darkMode', 'OFF');
  };

  // const [value, setValue] = useState(0);
  // const handleChange = (e: React.SyntheticEvent<Element, Event>, value: number): void => {
  //   setValue(value);
  // };

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
          <Tab component={Link} href="/cart" label="Cart" className={`${PREFIX}-navbar__tab`} disableRipple />
          <Tab component={Link} href="/login" label="Login" className={`${PREFIX}-navbar__tab`} disableRipple />
        </Tabs>
      </Toolbar>
    </StyledAppBar>
  );
}
