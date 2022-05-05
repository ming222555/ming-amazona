import { createTheme /* , responsiveFontSizes */ } from '@mui/material/styles';
import { red } from '@mui/material/colors';

import { arcBlue, arcOrange, arcGrey, lightBlue } from './colors';

export default createTheme({
  palette: {
    common: {
      blue: arcBlue,
      orange: arcOrange,
      grey: arcGrey,
      lightBlue,
    },
    mode: 'dark',
    primary: {
      main: arcBlue, // comment color key, o/w light.dark.mode no effect on the color here
    },
    secondary: {
      main: arcOrange,
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    h1: {
      fontSize: '1.6rem',
      fontWeight: 400,
      margin: '1rem 0',
      // lineHeight: 1.5,
      // color: arcBlue, // comment color key, o/w light.dark.mode no effect on the color here
    },
    h2: {
      fontSize: '1.4rem',
      fontWeight: 400,
      margin: '1rem 0',
      // color: arcBlue, // comment color key, o/w light.dark.mode no effect on the color here
      // lineHeight: 1.5,
    },
    //   h3: {
    //     fontFamily: "Pacifico",
    //     fontSize: "2.5rem",
    //     color: arcBlue,
    //   },
    //   h4: {
    //     fontFamily: "Raleway",
    //     fontSize: "1.75rem",
    //     color: arcBlue,
    //     fontWeight: 700,
    //   },
    //   h6: {
    //     fontWeight: 500,
    //     fontFamily: "Raleway",
    //     color: arcBlue,
    //     lineHeight: 1,
    //   },
    // subtitle1: {
    //   fontSize: '1.25rem',
    //   fontWeight: 300,
    //   color: arcGrey,
    // },
    //   subtitle2: {
    //     color: "white",
    //     fontWeight: 300,
    //     fontSize: "1.25rem",
    //   },
    body1: {
      fontSize: '1.25rem',
      color: arcGrey, // comment color key, o/w light.dark.mode no effect on the color here
      fontWeight: 300,
    },
    //   caption: {
    //     fontSize: "1rem",
    //     color: arcGrey,
    //     fontWeight: 300,
    //   },
    tab: {
      textTransform: 'none',
      fontWeight: 700,
      color: '#fff',
      fontSize: '1rem',
      opacity: 0.7,
    },
    brand: {
      textTransform: 'none',
      fontWeight: 700,
      color: '#fff',
      fontSize: '1.5rem',
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: 'transparent',
        },
      },
    },
  },
});
/* 
let theme = createTheme({
  palette: {
    common: {
      blue: arcBlue,
      orange: arcOrange,
    },
    primary: {
      main: arcBlue,
    },
    secondary: {
      main: arcOrange,
    },
  },
  typography: {
    h1: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: '2.5rem',
      color: arcBlue,
      lineHeight: 1.5,
    },
    h3: {
      fontFamily: 'Pacifico',
      fontSize: '2.5rem',
      color: arcBlue,
    },
    h4: {
      fontFamily: 'Raleway',
      fontSize: '1.75rem',
      color: arcBlue,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 300,
      color: arcGrey,
    },
    subtitle2: {
      color: 'white',
      fontWeight: 300,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1.25rem',
      color: arcGrey,
      fontWeight: 300,
    },
    caption: {
      fontSize: '1rem',
      color: arcGrey,
      fontWeight: 300,
    },
    tab: {
      fontFamily: 'Raleway',
      textTransform: 'none',
      fontWeight: 700,
      color: 'white',
      fontSize: '1rem',
      opacity: 0.7,
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
 */
