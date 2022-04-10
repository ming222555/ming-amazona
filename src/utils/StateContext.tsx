import React, { createContext, useReducer } from 'react';

import Cookies from 'js-cookie';

interface IFState {
  darkMode: boolean;
}

interface IFAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

interface IFStateContextValue {
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

export const StateContext = createContext<IFStateContextValue>({
  state: initialState,
  dispatch: (action: IFAction) => reducer(initialState, action),
});

export function StateContextProvider(props: { children: JSX.Element }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StateContext.Provider value={{ state, dispatch }}>{props.children}</StateContext.Provider>;
}
