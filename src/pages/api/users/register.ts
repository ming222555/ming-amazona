import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import bcrypt from 'bcryptjs';

import User from '../../../db/models/User';
import db from '../../../db/db';
import { signToken } from '../../../utils/auth';

export interface IFTokenUser {
  token: string;
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export type LoginRes = IFTokenUser | { errormsg: string };

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    // eslint-disable-next-line no-console
    console.log('db error');
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse<LoginRes>) => {
  await db.connect();
  const existUser = await User.findOne({ email: req.body.email });
  if (existUser) {
    await db.disconnect();
    res.status(401).send({ errormsg: 'Email already in use. Please enter another email.' });
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
