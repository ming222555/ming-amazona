import React from 'react';
import { css } from '@emotion/react';
// import Head from 'next/head';
// import Typography from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';

const base = css`
  color: hotpink;
`;

export default function Layout(): JSX.Element {
  return (
    <>
      <Typography sx={{ background: { xs: 'blue', md: 'yellow' } }}>Typography with sx</Typography>
      <br />
      <Typography
        sx={{ background: { xs: 'lightgreen', md: 'green' } }}
        css={css`
          color: white;
          :hover {
            color: green;
          }
        `}
      >
        Typography with sx and css prop
      </Typography>
      <div
        css={css`
          color: skyblue;
          :hover {
            color: yellow;
          }
        `}
      >
        simple html div only can use css prop but not sx
      </div>
      <div
        css={css`
          ${base};
          background-color: #eee;
        `}
      >
        This is hotpink... another simple div using css prop
      </div>
    </>
  );
}
