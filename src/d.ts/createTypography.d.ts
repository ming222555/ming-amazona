import '@mui/material/styles/createTypography';
/*
  https://stackoverflow.com/questions/70002471/mui-v5-extending-typography-variant-in-typescript-creates-error-no-overload-m
  https://mui.com/customization/typography/#adding-amp-disabling-variants
 */
declare module '@mui/material/styles/createTypography' {
  interface TypographyOptions {
    brand: React.CSSProperties;
    tab: React.CSSProperties;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    brand: React.CSSProperties;
    tab: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    brand?: React.CSSProperties;
    tab?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    brand: true;
    tab: true;
  }
}
