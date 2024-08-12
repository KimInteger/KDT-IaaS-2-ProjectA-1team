import React from 'react';
import { SettingStyles } from './teststyle';

// Define the type for the props
interface BackupRestoreModalProps {
  onClose: () => void;
}

const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ onClose }) => {
  // Function to handle backup button click
  const handleBackup = async () => {
    console.log('Backup request initiated.');

    try {
      const response = await fetch('http://localhost:8000/back/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Adjust the body as needed for your API
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Backup response received:', result);
    } catch (error) {
      console.error('Backup request failed:', error);
    }
  };

  return (
    <div className={SettingStyles.modalBackdrop}>
      <div className={SettingStyles.modalContent}>
        <h2>백업 및 복구</h2>
        <button className={SettingStyles.button} onClick={handleBackup}>
          백업
        </button>
        <select className={SettingStyles.selectBox} aria-label="옵션 선택">
          {/* Populate options dynamically as needed */}
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
        <button className={SettingStyles.button}>복구</button>
        <button className={SettingStyles.button} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default BackupRestoreModal;
