import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../../db/models/Order';
import db from '../../../../db/db';
import { onError, onNoMatch } from '../../../../utils/error/backend/error';
import { isAuth } from '../../../../utils/auth';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send(deliveredOrder);
  } else {
    await db.disconnect();
    res.status(404).send({ errormsg: 'Order not found', status: 404 });
  }
});

export default handler;
