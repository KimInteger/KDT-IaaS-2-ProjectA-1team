import Image from 'next/image';
import '../globals.css';
import Message from '../ui/testComponent/InputMessage';
import { styles } from '../ui/testComponent/stylesContent';

export default function Home() {
  return (
    <div className={styles.container}>
      <Message message="Hellow World" isSuccess={true} />
    </div>
  );
}
