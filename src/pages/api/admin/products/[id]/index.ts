import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Product from '../../../../../db/models/Product';
import db from '../../../../../db/db';
import { onError, onNoMatch } from '../../../../../utils/error/backend/error';
import { isAuth, isAdmin } from '../../../../../utils/auth';

// https://stackoverflow.com/questions/67009540/property-status-does-not-exist-on-type-serverresponse-ts2339
const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name.trim();
    product.slug = req.body.slug.trim();
    product.price = parseFloat(req.body.price);
    product.category = req.body.category.trim();
    product.image = req.body.image.trim();
    product.featuredImage = req.body.featuredImage.trim();
    // product.isFeatured = req.body.isFeatured;
    product.isFeatured = product.featuredImage ? 1 : 0;
    product.brand = req.body.brand.trim();
    product.countInStock = parseInt(req.body.countInStock);
    product.description = req.body.description.trim();
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ errormsg: 'Product not found', status: 404 });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: 'Product deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ errormsg: 'Product not found', status: 404 });
  }
});

export default handler;
