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
    const status = 401;
    res.status(status).send({ errormsg: 'Invalid user or password', status });
  }
});

export default handler;
