import React, { useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import { StateContext } from './utils/StateContext';
import defaultTheme from './Theme';
import themeDark from './ThemeDark';

export default function ThemeModeAdjust(props: { children: JSX.Element[] }): JSX.Element {
  const { state } = useContext(StateContext);
  const { darkMode } = state;

  if (!darkMode) {
    return <ThemeProvider theme={defaultTheme}>{props.children}</ThemeProvider>;
  }
  return <ThemeProvider theme={themeDark}>{props.children}</ThemeProvider>;
}
