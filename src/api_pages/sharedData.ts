import { IFTokenUser } from '../pages/api/users/login';

export const initialState: IFTokenUser = {
  token: '',
  _id: '',
  name: '',
  email: '',
  isAdmin: false,
};
