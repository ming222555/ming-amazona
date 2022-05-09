import bcrypt from 'bcryptjs';

import { IFUser, IFProduct } from './rdbms_tbl_cols';

type IFUserWithoutMongo = Omit<IFUser, '_id' | 'createdAt' | 'updatedAt'>;

const users: IFUserWithoutMongo[] = [
  {
    name: 'John',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    name: 'Jane',
    email: 'user@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
  },
];

type IFProductWithoutMongo = Omit<IFProduct, '_id' | 'createdAt' | 'updatedAt'>;

const products: IFProductWithoutMongo[] = [
  {
    name: 'Free Shirt',
    slug: 'free-shirt',
    category: 'Shirts',
    image: '/images/shirt1.jpg',
    isFeatured: 1,
    featuredImage: '/images/banner1.jpg',
    price: 15,
    brand: 'Nike',
    rating: 0,
    numReviews: 0,
    countInStock: 20,
    description: 'A popular shirt',
  },
  {
    name: 'Fit Shirt',
    slug: 'fit-shirt',
    category: 'Shirts',
    image: '/images/shirt2.jpg',
    isFeatured: 1,
    featuredImage: '/images/banner2.jpg',
    price: 20,
    brand: 'Adidas',
    rating: 0,
    numReviews: 0,
    countInStock: 20,
    description: 'A popular shirt',
  },
  {
    name: 'Slim Shirt',
    slug: 'slim-shirt',
    category: 'Shirts',
    image: '/images/shirt3.jpg',
    isFeatured: 0,
    featuredImage: '',
    price: 15,
    brand: 'Raymond',
    rating: 0,
    numReviews: 0,
    countInStock: 20,
    description: 'A popular shirt',
  },
  {
    name: 'Golf Pants',
    slug: 'golf-pants',
    category: 'Pants',
    image: '/images/pants1.jpg',
    isFeatured: 0,
    featuredImage: '',
    price: 150,
    brand: 'Oliver',
    rating: 0,
    numReviews: 0,
    countInStock: 20,
    description: 'Smart looking pants',
  },
  {
    name: 'Fit Pants',
    slug: 'fit-pants',
    category: 'Pants',
    image: '/images/pants2.jpg',
    isFeatured: 1,
    featuredImage: '',
    price: 100,
    brand: 'Zara',
    rating: 0,
    numReviews: 0,
    countInStock: 20,
    description: 'A popular pants',
  },
  {
    name: 'Classic Pants',
    slug: 'classic-pants',
    category: 'Pants',
    image: '/images/pants3.jpg',
    isFeatured: 0,
    featuredImage: '',
    price: 300,
    brand: 'Casely',
    rating: 0,
    numReviews: 0,
    countInStock: 20,
    description: 'A popular pants',
  },
];

const data = {
  users,
  products,
};
export default data;
