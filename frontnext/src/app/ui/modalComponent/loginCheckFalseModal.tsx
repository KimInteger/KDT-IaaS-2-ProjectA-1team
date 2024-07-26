'use client';

import React from 'react';

interface ModalProps {
  message: string;
  onClose: () => void;
}

const LoginCheckFalseModal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <p>{message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default LoginCheckFalseModal;
