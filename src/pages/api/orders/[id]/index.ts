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

handler.get(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    if (order.user != req.body.appended_user._id) {
      await db.disconnect();
      const status = 400;
      res.status(status).send({ errormsg: 'Invalid Order id', status });
      return;
    }
    await db.disconnect();
    res.send(order);
  } else {
    await db.disconnect();
    const status = 404;
    res.status(status).send({ errormsg: 'Order Id not found', status });
  }
});

export default handler;
