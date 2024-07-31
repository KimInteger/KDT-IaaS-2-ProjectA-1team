'use client';

import React, { useState, FormEvent } from 'react';
import Form from './testComponent/MakeFormSection';
import Message from './testComponent/InputMessage';
import { styles } from './testComponent/stylesContent';
import {
  SUCCESS_MESSAGE,
  FAILURE_MESSAGE,
} from './testComponent/labelsContent';
import { fetchData } from '../lib/fetchDataTest';

// * 정호연이 작업한 모듈
import TableModal from './modal/components/tableModal';
import HeaderSection from './Header/headerSection';

const RenderLoginFormSection: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Assume fetchData is a function that sends data to the server and returns true or false
    const response = await fetchData({ id, password });
    if (response) {
      setMessage(SUCCESS_MESSAGE);
      setIsSuccess(true);
    } else {
      setMessage(FAILURE_MESSAGE);
      setIsSuccess(false);
    }
  };

  return <HeaderSection />;
};

export default RenderLoginFormSection;
