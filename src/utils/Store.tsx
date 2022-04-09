import React, { createContext, useReducer } from 'react';

interface IFState {
  darkMode: boolean;
}

interface IFAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

interface StoreValue {
  state: IFState;
  dispatch: React.Dispatch<IFAction>;
}

const initialState = {
  darkMode: false,
};

function reducer(state: IFState, action: IFAction): IFState {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    default:
      return state;
  }
}

export const Store = createContext<StoreValue>({
  state: initialState,
  dispatch: (action: IFAction) => reducer(initialState, action),
});

export function StoreProvider(props: { children: JSX.Element }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Store.Provider value={{ state, dispatch }}>{props.children}</Store.Provider>;
}
