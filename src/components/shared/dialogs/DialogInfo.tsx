import React from 'react';

import Dialog from './Dialog';
import styles from './DialogInfo.module.scss';

export default function DialogInfo(props: { onCancel: () => void; info: string }): JSX.Element {
  return (
    <Dialog onCancel={props.onCancel}>
      {/* <div className={styles.DialogBody}>
        <p className={styles.info}>{props.info}</p>
        <div className={styles.Actions + ' p-3'}>
          <button
            type="button"
            className={styles.Action + ' ' + styles.ActionNo + ' btn btn-outline-primary ml-3'}
            onClick={props.onCancel}
          >
            Ok
          </button>
        </div>
      </div> */}
      <div className={styles.DialogInfo + ' ' + styles.categories}>
        <nav className={styles.category__tabs}>
          <a className={styles.category__tab}>
            <span className={styles.category__tabtext + ' ' + styles.active}>Local</span>
            <div className={styles.category__tabpane}>Pane local</div>
          </a>
          <a className={styles.category__tab}>
            <span className={styles.category__tabtext}>Goods</span>
            <div className={styles.category__tabpane}>Pane goods</div>
          </a>
          {/* <a className={styles.category__tab}>
            <span className={styles.category__tabtext}>Hotels & Travel</span>
            <div className={styles.category__tabpane}>Pane hotels & travel</div>
          </a>
          <a className={styles.category__tab}>
            <span className={styles.category__tabtext}>Coupons</span>
            <div className={styles.category__tabpane}>Pane coupons</div>
          </a>
          <a className={styles.category__tab}>
            <span className={styles.category__tabtext}>Coupons 2</span>
            <div className={styles.category__tabpane}>Pane coupons 2</div>
          </a>
          <a className={styles.category__tab}>
            <span className={styles.category__tabtext}>Coupons 3</span>
            <div className={styles.category__tabpane}>Pane coupons 3</div>
          </a>
          <a className={styles.category__tab}>
            <span className={styles.category__tabtext}>Coupons 4</span>
            <div className={styles.category__tabpane}>Pane coupons 4</div>
          </a> */}
        </nav>
      </div>
    </Dialog>
  );
}
