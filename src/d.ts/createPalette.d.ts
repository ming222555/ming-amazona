import '@mui/material/styles/createPalette';
/* https://stackoverflow.com/questions/68430166/how-to-add-custom-colors-name-on-material-ui-with-typescript
  const theme = createTheme({
    palette: {
      common: {
        tan,
        lightRed,
        red,
        offBlack,
        white,
      },
    },
  });
*/
declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    blue: string;
    orange: string;
  }
}
