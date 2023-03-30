import React from 'react';

import AbstractDialog from './AbstractDialog';
import DialogOverlay from './DialogOverlay';

class Dialog extends AbstractDialog {
  render(): JSX.Element {
    return (
      <DialogOverlay onCancel={this.props.onCancel} el={this.el}>
        {this.props.children}
      </DialogOverlay>
    );
  }
}

export default Dialog;
