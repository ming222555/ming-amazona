import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import Order from '../../../db/models/Order';
import db from '../../../db/db';
import { onError, onNoMatch } from '../../../utils/error/backend/error';
import { isAuth, isAdmin } from '../../../utils/auth';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({}).populate('user', 'name');
  await db.disconnect();
  res.send(orders);
});

export default handler;
