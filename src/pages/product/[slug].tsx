import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import data from '../../utils/data';

const ProductPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }
  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  );
};

export default ProductPage;
