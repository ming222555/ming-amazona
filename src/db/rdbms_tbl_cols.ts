export interface IFUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// values of _id, createdAt and updatedAt are auto gen from mongo.
export interface IFProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  isFeatured: boolean;
  featuredImage: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}
