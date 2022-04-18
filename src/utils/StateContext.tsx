import React, { createContext, useReducer } from 'react';

import { IFCartItem, IFShippingAddress } from '../db/rdbms_tbl_cols';
import { IFTokenUser } from '../pages/api/users/login';
import { initialCartItemsState, initialTokenUserState, initialShippingAddressState } from '../api_pages/sharedData';

import cookieSet, { cookieRemove } from '../utils/cookieSet';

interface IFState {
  darkMode: boolean;
  cart: { cartItems: IFCartItem[]; shippingAddress: IFShippingAddress };
  userInfo: IFTokenUser;
}

const initialState: IFState = {
  darkMode: false,
  cart: { cartItems: initialCartItemsState, shippingAddress: initialShippingAddressState },
  userInfo: initialTokenUserState,
};

interface IFAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

interface IFStateContextValue {
  state: IFState;
  dispatch: React.Dispatch<IFAction>;
}

function reducer(state: IFState, action: IFAction): IFState {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM':
      const newItem: IFCartItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => item._id === newItem._id);
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => (item._id !== newItem._id ? item : newItem))
        : [...state.cart.cartItems, newItem];

      cookieSet('cartItems', cartItems);
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM':
      const remainingCartItems = state.cart.cartItems.filter((item) => item._id !== action.payload);
      cookieSet('cartItems', remainingCartItems);
      return { ...state, cart: { ...state.cart, cartItems: remainingCartItems } };
    case 'SET_CART_ITEMS':
      return { ...state, cart: { ...state.cart, cartItems: action.payload } };
    case 'SAVE_SHIPPING_ADDRESS':
      cookieSet('shippingAddress', action.payload);
      return { ...state, cart: { ...state.cart, shippingAddress: action.payload } };
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, cart: { ...state.cart, shippingAddress: action.payload } };
    case 'USER_LOGIN':
      cookieSet('userInfo', action.payload);
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      cookieRemove('userInfo');
      cookieRemove('cartItems');
      cookieRemove('shippingAddress');
      return { ...state, userInfo: initialTokenUserState, cart: { ...state.cart, cartItems: [] } };
    default:
      return state;
  }
}

const StateContext = createContext<IFStateContextValue>({
  state: initialState,
  dispatch: (action: IFAction) => reducer(initialState, action),
});

export function StateContextProvider(props: { children: JSX.Element }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StateContext.Provider value={{ state, dispatch }}>{props.children}</StateContext.Provider>;
}

export default StateContext;
