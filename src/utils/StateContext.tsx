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
      if (!existItem) {
        const cartItems = [...state.cart.cartItems, newItem];
        cookieSet('cartItems', cartItems);
        return { ...state, cart: { cartItems } };
      }

      const newItemDup: IFCartItem = { ...newItem, quantity: existItem.quantity + newItem.quantity };
      const existItemPos = state.cart.cartItems.findIndex((item) => item._id === newItem._id);
      const cartItemsDup: IFCartItem[] = [...state.cart.cartItems];
      cartItemsDup[existItemPos] = newItemDup;

      cookieSet('cartItems', cartItemsDup);
      return { ...state, cart: { cartItems: cartItemsDup } };
    case 'SET_CART_ITEMS':
      const cartItems: IFCartItem[] = action.payload;
      return { ...state, cart: { ...state.cart, cartItems } };
    default:
      return state;
  }
}

export const StateContext = createContext<IFStateContextValue>({
  state: initialState,
  dispatch: (action: IFAction) => reducer(initialState, action),
});

export function StateContextProvider(props: { children: JSX.Element }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StateContext.Provider value={{ state, dispatch }}>{props.children}</StateContext.Provider>;
}
