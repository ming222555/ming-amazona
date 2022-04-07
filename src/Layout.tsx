import React from 'react';
import Head from 'next/head';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { styled, useTheme } from '@mui/material/styles';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';

// import Link from './Link';

import Header from './layout/Header';
import Footer from './layout/Footer';

// const PREFIX = 'Layout';

// const StyledAppBar = styled(AppBar)(({ theme }) => ({
//   [`&.${PREFIX}-navbar`]: {
//     [`& .${PREFIX}-navbar__middle`]: {
//       flex: '1 1 auto',
//       background: 'skyblue',
//     },
//     [`& .${PREFIX}-navbar__tab`]: {
//       ...theme.typography.tab,
//       marginLeft: 10,
//       '&:first-child': {
//         marginLeft: 0,
//       },
//     },
//   },
// }));

export default function Layout(props: { children: JSX.Element }): JSX.Element {
  // const theme = useTheme();

  return (
    <div>
      <Head>
        <title>Next Amazona</title>
      </Head>
      <Header />
      <Container component="main" style={{ minHeight: '80vh' }}>
        {props.children}
      </Container>
      <Footer />
    </div>
  );
}
