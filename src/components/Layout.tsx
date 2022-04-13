import React from 'react';
import Head from 'next/head';
import Container from '@mui/material/Container';

import Header from './Header';
import Footer from './Footer';

export default function Layout(props: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}): JSX.Element {
  return (
    <div>
      <Head>
        <title>{props.title ? `${props.title} - Next Amazona` : 'Next Amazona'}</title>
        {props.description && <meta name="description" content={props.description} />}
      </Head>
      <Header />
      <Container component="main" style={{ minHeight: '80vh' }}>
        {props.children}
      </Container>
      <Footer />
    </div>
  );
}
