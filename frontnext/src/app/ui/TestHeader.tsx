'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './headerStyles.module.css'; // CSS 모듈 파일을 import

const TestHeader: React.FC = () => {
  const router = useRouter();

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <header className={styles.header}>
      <div className={styles.tab} onClick={() => handleTabClick('/testField')}>
        조회
      </div>
      <div className={styles.tab} onClick={() => handleTabClick('/testCreate')}>
        생성
      </div>
      <div className={styles.tab} onClick={() => handleTabClick('/testSet')}>
        설정
      </div>
    </header>
  );
};

export default TestHeader;
