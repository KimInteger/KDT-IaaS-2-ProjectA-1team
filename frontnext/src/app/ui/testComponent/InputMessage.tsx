import React from 'react';
import { styles } from './stylesContent';

interface MessageProps {
  message: string;
  isSuccess: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isSuccess }) => {
  // isSuccess가 true일 때만 메시지를 렌더링
  return isSuccess ? (
    <div className={styles.messageContainer}>
      <h1 className={styles.successText}>{message}</h1>
    </div>
  ) : null;
};

export default Message;
