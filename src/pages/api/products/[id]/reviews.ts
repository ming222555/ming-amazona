import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Product from '../../../../db/models/Product';
import db from '../../../../db/db';
import { onError, onNoMatch } from '../../../../utils/error/backend/error';
import { isAuth } from '../../../../utils/auth';
import mongoose from 'mongoose';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  if (product) {
    res.send(product.reviews);
  } else {
    res.status(404).send({ errormsg: 'Product not found', status: 404 });
  }
});

handler.use(isAuth).post(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    const existReview = product.reviews.find((x: { user: string }) => x.user === req.body.appended_user._id);
    if (existReview) {
      await Product.updateOne(
        { _id: req.query.id, 'reviews._id': existReview._id },
        {
          $set: {
            'reviews.$.comment': req.body.comment,
            'reviews.$.rating': Number(req.body.rating),
          },
        },
      );
      await db.disconnect();
      res.send({ message: 'Review updated' });
    } else {
      const review = {
        user: mongoose.Types.ObjectId(req.body.appended_user._id),
        name: req.body.appended_user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
        createAt: Date.now(),
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product.rating = product.reviews.reduce((a: any, c: any) => c.rating + a, 0) / product.reviews.length;
      await product.save();
      await db.disconnect();
      res.status(201).send({ message: 'Review submitted successfully' });
    }
  } else {
    await db.disconnect();
    res.status(404).send({ errormsg: 'Product not found', status: 404 });
  }
});

export default handler;
