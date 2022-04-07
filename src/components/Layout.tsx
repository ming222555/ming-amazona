import React from 'react';
import Head from 'next/head';
import Container from '@mui/material/Container';

import Header from './Header';
import Footer from './Footer';

export default function Layout(props: { children: JSX.Element }): JSX.Element {
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
