import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import Order from '../../../db/models/Order';
import Product from '../../../db/models/Product';
import User from '../../../db/models/User';
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
  const ordersCount = await Order.countDocuments({ isPaid: false });
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  const salesData = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: { $toDate: '$createAt' } } }, // by month
        // _id: { $dateToString: { format: '%Y-%M', date: { $toDate: '$createAt' } } }, // by Minute
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  await db.disconnect();
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;
