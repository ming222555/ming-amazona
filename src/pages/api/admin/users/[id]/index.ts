import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import User from '../../../../../db/models/User';
import db from '../../../../../db/db';
import { onError, onNoMatch } from '../../../../../utils/error/backend/error';
import { isAuth, isAdmin } from '../../../../../utils/auth';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.name = req.body.name;
    user.isAdmin = Boolean(req.body.isAdmin);
    await user.save();
    await db.disconnect();
    res.send({ message: 'User updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ errormsg: 'User not found', status: 404 });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: 'User deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ errormsg: 'User not found', status: 404 });
  }
});

export default handler;
