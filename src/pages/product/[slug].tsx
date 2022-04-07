import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import Link from '../../components/Link';
import Layout from '../../components/Layout';
import data from '../../utils/data';

const ProductPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }
  return (
    <Layout title={product.name}>
      <div>
        <Link href="/">back to products</Link>
      </div>
    </Layout>
  );
};

export default ProductPage;
