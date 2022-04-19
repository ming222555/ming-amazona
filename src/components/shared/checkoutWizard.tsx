import React from 'react';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

export default function CheckoutWizard(props: { activeStep: number }): JSX.Element {
  return (
    <Stepper activeStep={props.activeStep} alternativeLabel style={{ marginBottom: '1rem' }}>
      {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
