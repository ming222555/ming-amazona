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
  await db.connect();
  const products = await Product.find({}, '-reviews');
  await db.disconnect();
  res.send(products);
});

export default handler;
