// stuff without fields _id, createdAt and updatedAt are NOT a database table!
// values of _id, createdAt and updatedAt are auto gen from mongo.

export interface IFUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: number;
  updatedAt: number;
}

export type IFProfile = Omit<IFUser, '_id' | 'password' | 'createdAt' | 'updatedAt'>;

export interface IFProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  isFeatured: number;
  featuredImage: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  reviews?: IFProductReview[];
  createdAt: number;
  updatedAt: number;
}

export interface IFProductReview {
  _id: string;
  user: string /* user_id */;
  name: string /* user name */;
  rating: number;
  comment: string;
  createAt: number;
  updateAt: number;
}

export interface IFCartItem extends IFProduct {
  quantity: number;
}

export interface IFOrderItem {
  product_id: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
}

export interface IFShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IFOrder {
  _id: string;
  user_id: string;
  orderItems: IFOrderItem[];
  shippingAddress: IFShippingAddress;
  paymentMode: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: number;
  deliveredAt: number;
  createAt: number;
  updateAt: number;
}

export interface IFSalesSummary {
  ordersCount: number;
  productsCount: number;
  usersCount: number;
  ordersPrice: number;
  salesData: {
    _id: string;
    totalSales: number;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IFOrderWithPaymentPayPalResult extends IFOrder {
  id: string;
  status: string;
  email_address: string;
}
