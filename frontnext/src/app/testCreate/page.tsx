import Image from 'next/image';
import '../globals.css';
import Message from '../ui/testComponent/InputMessage';
import { styles } from '../ui/testComponent/stylesContent';
import TestHeader from '../ui/TestHeader';

export default function Home() {
  return (
    <div>
      <TestHeader />
      <main>
        <h1>Welcome to the Page</h1>
        <div className={styles.container}>
          <Message message="Hellow Create" isSuccess={true} />
        </div>
      </main>
    </div>
  );
}
