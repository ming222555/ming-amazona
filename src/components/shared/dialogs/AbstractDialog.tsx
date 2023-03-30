import React from 'react';

type _Props = {
  children: React.ReactNode;
  onCancel: () => void;
};

abstract class AbstractDialog extends React.Component<_Props> {
  el: HTMLElement;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById('modal-root')!.appendChild(this.el);
  }

  componentWillUnmount(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById('modal-root')!.removeChild(this.el);
  }
}

export default AbstractDialog;
