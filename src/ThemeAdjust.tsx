import React, { useContext } from 'react';
import { Theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

import { Store } from './utils/Store';

export default function ThemeAdjust(props: { children: JSX.Element; theme: Theme }): JSX.Element {
  const { state } = useContext(Store);
  const { darkMode } = state;
  props.theme.palette.mode = darkMode ? 'dark' : 'light';

  return <ThemeProvider theme={props.theme}>{props.children}</ThemeProvider>;
}
