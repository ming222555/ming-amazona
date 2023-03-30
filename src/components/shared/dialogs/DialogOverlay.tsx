import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styles from './DialogOverlay.module.scss';

type _Props = {
  onCancel: () => void;
  children: ReactNode;
  el: HTMLElement;
};

function DialogOverlay(props: _Props): React.ReactPortal {
  const oncloseHandler = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    props.onCancel();
  };

  return ReactDOM.createPortal(
    <div className={styles.DialogOverlay} onClick={oncloseHandler}>
      <div onClick={(e): void => e.stopPropagation()} className={styles.DialogBodyPadded}>
        <span className={styles.xclose} onClick={oncloseHandler}>
          x
        </span>
        {/* for stop propagation */}
        {props.children}
      </div>
    </div>,
    props.el,
  );
}

export default DialogOverlay;
