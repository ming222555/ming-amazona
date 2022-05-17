import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { onError, onNoMatch } from '../../../utils/error/backend/error';
import { isAuth } from '../../../utils/auth';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || 'nokey');
});

export default handler;
