import React, { createContext, useReducer } from 'react';

import { IFCartItem } from '../db/rdbms_tbl_cols';
import cookieSet from '../utils/cookieSet';

interface IFState {
  darkMode: boolean;
  cart: { cartItems: IFCartItem[] };
}

const initialState: IFState = {
  darkMode: false,
  cart: { cartItems: [] },
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
    case 'SET_CART_ITEMS':
      return { ...state, cart: { ...state.cart, cartItems: action.payload } };
    case 'CART_REMOVE_ITEM':
      const remainingCartItems = state.cart.cartItems.filter((item) => item._id !== action.payload);
      cookieSet('cartItems', remainingCartItems);
      return { ...state, cart: { ...state.cart, cartItems: remainingCartItems } };
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
