import { IFTokenUser } from '../pages/api/users/login';
import { IFCartItem, IFShippingAddress } from '../db/rdbms_tbl_cols';

export const initialCartItemsState: IFCartItem[] = [];

export const initialTokenUserState: IFTokenUser = {
  token: '',
  _id: '',
  name: '',
  email: '',
  isAdmin: false,
};

export const initialShippingAddressState: IFShippingAddress = {
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  location: {
    lat: 0,
    lng: 0,
    address: '',
    name: '',
    vicinity: '',
    googleAddressId: '',
  },
};
