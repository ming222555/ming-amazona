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
  const user = await User.findOne({ email: req.body.email });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    // https://www.codegrepper.com/code-examples/typescript/nextjs+api+response+in+typescript
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ errormsg: 'Invalid user or password' });
  }
});

export default handler;
