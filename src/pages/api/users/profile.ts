import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import bcrypt from 'bcryptjs';

import User from '../../../db/models/User';
import db from '../../../db/db';
import { onError, onNoMatch } from '../../../utils/error/backend/error';
import { isAuth, signToken } from '../../../utils/auth';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.body.appended_user._id);
  if (user) {
    await db.disconnect();

    res.send({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    await db.disconnect();
    res.status(401).send({ errormsg: 'Invalid User', status: 401 });
  }
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.body.appended_user._id);
  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password ? bcrypt.hashSync(req.body.password) : user.password;

    const updatedUser = await user.save();
    await db.disconnect();

    const token = signToken(updatedUser);
    // https://www.codegrepper.com/code-examples/typescript/nextjs+api+response+in+typescript
    res.send({
      token,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    await db.disconnect();
    res.status(401).send({ errormsg: 'Invalid User', status: 401 });
  }
});

export default handler;
