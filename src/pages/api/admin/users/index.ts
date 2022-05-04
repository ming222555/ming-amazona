import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import User from '../../../../db/models/User';
import db from '../../../../db/db';
import { onError, onNoMatch } from '../../../../utils/error/backend/error';
import { isAuth, isAdmin } from '../../../../utils/auth';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;
