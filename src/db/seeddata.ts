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
    isFeatured: true,
    featuredImage: '/images/banner1.jpg',
    price: 1.5,
    brand: 'Nike',
    rating: 4.5,
    numReviews: 10,
    countInStock: 20,
    description: 'A popular shirt',
  },
  {
    name: 'Fit Shirt',
    slug: 'fit-shirt',
    category: 'Shirts',
    image: '/images/shirt2.jpg',
    isFeatured: true,
    featuredImage: '/images/banner2.jpg',
    price: 2,
    brand: 'Adidas',
    rating: 4.2,
    numReviews: 10,
    countInStock: 20,
    description: 'A popular shirt',
  },
  {
    name: 'Slim Shirt',
    slug: 'slim-shirt',
    category: 'Shirts',
    image: '/images/shirt3.jpg',
    isFeatured: false,
    featuredImage: '',
    price: 1,
    brand: 'Raymond',
    rating: 4.5,
    numReviews: 10,
    countInStock: 20,
    description: 'A popular shirt',
  },
  {
    name: 'Golf Pants',
    slug: 'golf-pants',
    category: 'Pants',
    image: '/images/pants1.jpg',
    isFeatured: false,
    featuredImage: '',
    price: 1,
    brand: 'Oliver',
    rating: 4.5,
    numReviews: 10,
    countInStock: 20,
    description: 'Smart looking pants',
  },
  {
    name: 'Fit Pants',
    slug: 'fit-pants',
    category: 'Pants',
    image: '/images/pants2.jpg',
    isFeatured: false,
    featuredImage: '',
    price: 1.5,
    brand: 'Zara',
    rating: 4.5,
    numReviews: 10,
    countInStock: 20,
    description: 'A popular pants',
  },
  {
    name: 'Classic Pants',
    slug: 'classic-pants',
    category: 'Pants',
    image: '/images/pants3.jpg',
    isFeatured: false,
    featuredImage: '',
    price: 2,
    brand: 'Casely',
    rating: 4.5,
    numReviews: 10,
    countInStock: 20,
    description: 'A popular pants',
  },
];

const data = {
  users,
  products,
};
export default data;
