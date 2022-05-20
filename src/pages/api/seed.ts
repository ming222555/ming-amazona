import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Product from '../../db/models/Product';
import User from '../../db/models/User';
import Order from '../../db/models/Order';
import db from '../../db/db';
import data from '../../db/seeddata';
import { onError, onNoMatch } from '../../utils/error/backend/error';
import mongoose from 'mongoose';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});

handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await Order.deleteMany();
  await db.disconnect();
  const status = 201;
  mongoose.connection.db.dropCollection('orders', function (err) {
    // eslint-disable-next-line no-console
    console.log('dropCollection error', err);
  });

  res.status(status).send({ message: 'seeded successfully', status });
});

export default handler;
