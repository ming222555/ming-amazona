import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styles from './DialogOverlay.module.scss';

type _Props = {
  onCancel: () => void;
  children: ReactNode;
  el: HTMLElement;
};

function DialogOverlay(props: _Props): React.ReactPortal {
  return ReactDOM.createPortal(
    <div
      className={styles.DialogOverlay}
      onClick={(e): void => {
        e.stopPropagation();
        props.onCancel();
      }}
    >
      <div onClick={(e): void => e.stopPropagation()} className={styles.DialogBodyPadded}>
        {' '}
        {/* for stop propagation */}
        {props.children}
      </div>
    </div>,
    props.el,
  );
}

export default DialogOverlay;
