import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Product from '../../../db/models/Product';
import db from '../../../db/db';
import { onError, onNoMatch } from '../../../utils/error/backend/error';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});

handler.get(async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('get categories');
  await db.connect();
  const categories = await Product.find().distinct('category');
  await db.disconnect();
  res.send(categories);
});

export default handler;
