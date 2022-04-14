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

export { signToken };
