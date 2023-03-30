import React, { useState } from 'react';

import Dialog from './Dialog';
import styles from './DialogInfo.module.scss';

export default function DialogInfo(props: { onCancel: () => void; info: string }): JSX.Element {
  const [activeTabId, setActiveTabId] = useState('tabtext1');

  const onHoverHandler = (e: React.MouseEvent<HTMLElement>): void => {
    setActiveTabId(e.currentTarget.id);
  };

  return (
    <Dialog onCancel={props.onCancel}>
      <div className={styles.DialogInfo + ' ' + styles.categories}>
        <nav className={styles.category__tabs}>
          <a className={styles.category__tab}>
            <span
              className={styles.category__tabtext + `${activeTabId === 'tabtext1' ? ' ' + styles.active : ''}`}
              id="tabtext1"
              onMouseOver={onHoverHandler}
            >
              Info
            </span>
            <div className={styles.category__tabpane}>{props.info}</div>
          </a>
          <a className={styles.category__tab}>
            <span
              className={styles.category__tabtext + `${activeTabId === 'tabtext2' ? ' ' + styles.active : ''}`}
              id="tabtext2"
              onMouseOver={onHoverHandler}
            >
              Details
            </span>
            <div className={styles.category__tabpane}>Details of {props.info}...</div>
          </a>
        </nav>
      </div>
    </Dialog>
  );
}
