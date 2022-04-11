export interface IFUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface IFProduct {
  name: string;
  slug: string;
  category: string;
  image: string;
  isFeatured?: boolean;
  featuredImage?: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
}
