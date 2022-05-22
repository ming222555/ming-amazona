import React, { createContext, useReducer } from 'react';

import { IFCartItem, IFShippingAddress } from '../db/rdbms_tbl_cols';
import { IFTokenUser } from '../pages/api/users/login';
import { initialCartItemsState, initialTokenUserState, initialShippingAddressState } from '../api_pages/sharedData';

import cookieSet, { cookieRemove } from '../utils/cookieSet';

interface IFState {
  darkMode: boolean;
  cart: { cartItems: IFCartItem[]; shippingAddress: IFShippingAddress };
  userInfo: IFTokenUser;
  searchQuery: number;
}

const initialState: IFState = {
  darkMode: false,
  cart: { cartItems: initialCartItemsState, shippingAddress: initialShippingAddressState },
  userInfo: initialTokenUserState,
  searchQuery: 0,
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
      const newShippingAddress = { ...state.cart.shippingAddress, ...action.payload };
      cookieSet('shippingAddress', newShippingAddress);
      return { ...state, cart: { ...state.cart, shippingAddress: newShippingAddress } };
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      const newShippingAddress2 = { ...state.cart.shippingAddress, location: action.payload };
      cookieSet('shippingAddress', newShippingAddress2);
      return { ...state, cart: { ...state.cart, shippingAddress: newShippingAddress2 } };
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, cart: { ...state.cart, shippingAddress: action.payload } };
    case 'CART_CLEAR':
      cookieRemove('cartItems');
      return { ...state, cart: { ...state.cart, cartItems: initialCartItemsState } };
    case 'USER_LOGIN':
      cookieSet('userInfo', action.payload);
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      cookieRemove('userInfo');
      cookieRemove('cartItems');
      cookieRemove('shippingAddress');
      return {
        ...state,
        userInfo: initialTokenUserState,
        cart: { cartItems: initialCartItemsState, shippingAddress: initialShippingAddressState },
      };
    case 'SEARCH_QUERY_ACTIVATE_CLEAR':
      return { ...state, searchQuery: Math.random() };
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
