import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { IFUser } from '../db/rdbms_tbl_cols';

const signToken = (user: IFUser): string => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '30d',
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAuth = async (req: NextApiRequest, res: NextApiResponse, next: any): Promise<void> => {
  const { authorization } = req.headers;
  const status = 401;
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decode) => {
      if (err) {
        res.status(status).send({ errormsg: 'Invalid token', status });
      } else {
        req.body.appended_user = decode;
        next();
      }
    });
  } else {
    res.status(status).send({ errormsg: 'Token not found', status });
  }
};

export { signToken };
