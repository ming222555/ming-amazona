import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import bcrypt from 'bcryptjs';

import User from '../../../db/models/User';
import db from '../../../db/db';
import { onError, onNoMatch } from '../../../utils/error/backend/error';
import { signToken } from '../../../utils/auth';

export interface IFTokenUser {
  token: string;
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});

handler.post(async (req: NextApiRequest, res: NextApiResponse<IFTokenUser | { errormsg: string; status: number }>) => {
  await db.connect();
  const existUser = await User.findOne({ email: req.body.email });
  if (existUser) {
    await db.disconnect();
    const status = 401;
    res.status(status).send({ errormsg: 'Email already in use. Please enter another email.', status });
    return;
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });
  const user = await newUser.save();
  await db.disconnect();

  const token = signToken(user);
  // https://www.codegrepper.com/code-examples/typescript/nextjs+api+response+in+typescript
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
