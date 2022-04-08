import React /* , { useState } */ from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Link from '../components/Link';

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

  // const [value, setValue] = useState(0);

  // const handleChange = (e: React.SyntheticEvent<Element, Event>, value: number): void => {
  //   setValue(value);
  // };

  return (
    <StyledAppBar position="static" className={`${PREFIX}-navbar`}>
      <Toolbar>
        <Link href="/">
          <Typography style={{ ...theme.typography.brand }}>amazona</Typography>
        </Link>
        <div className={`${PREFIX}-navbar__middle`}>&nbsp;</div>
        <Tabs /* value={value} onChange={handleChange} indicatorColor="primary" */>
          <Tab component={Link} href="/cart" label="Cart" className={`${PREFIX}-navbar__tab`} disableRipple />
          <Tab component={Link} href="/login" label="Login" className={`${PREFIX}-navbar__tab`} disableRipple />
        </Tabs>
      </Toolbar>
    </StyledAppBar>
  );
}
