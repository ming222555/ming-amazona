import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const ShippingPage: NextPage = () => {
  const router = useRouter();
  router.push('/login');
  return <div></div>;
};

export default ShippingPage;
