import React from 'react';

import Dialog from './Dialog';
import styles from './DialogInfo.module.scss';

export default function DialogInfo(props: { onCancel: () => void; info: string }): JSX.Element {
  return (
    <Dialog onCancel={props.onCancel}>
      <div className={styles.DialogInfo}>
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
      </div>
    </Dialog>
  );
}
