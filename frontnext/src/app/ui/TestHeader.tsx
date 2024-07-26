'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../headerStyles.module.css'; // CSS 모듈을 import
import { TESTROUTES, TABMENUTEXTS } from './testComponent/routerPath';

const TestHeader: React.FC = () => {
  const router = useRouter();

  const handleTabClick = (routeKey: keyof typeof TESTROUTES) => {
    router.push(TESTROUTES[routeKey]);
  };

  return (
    <header className={styles.header}>
      <div className={styles.tab} onClick={() => handleTabClick('TAB_ONE')}>
        {TABMENUTEXTS.TABMENUONE}
      </div>
      <div className={styles.tab} onClick={() => handleTabClick('TAB_TWO')}>
        {TABMENUTEXTS.TABMENUTWO}
      </div>
      <div className={styles.tab} onClick={() => handleTabClick('TAB_THREE')}>
        {TABMENUTEXTS.TABMENUTHREE}
      </div>
    </header>
  );
};

export default TestHeader;
