import React from 'react';
import CreateTableStyle from '../styles/ModalStyles';

interface InputFieldProps {
  id: number;
  value: string;
  error: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete?: (
    id: number,
    containerRef: React.RefObject<HTMLDivElement>,
    setCount: React.Dispatch<React.SetStateAction<number>>,
  ) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  value,
  error,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onChange,
  handleDelete,
  containerRef,
  setCount,
}) => (
  <div key={id} id={`set-${id}`} className={CreateTableStyle.container}>
    <div className="flex items-center w-full">
      <input
        type="text"
        value={value}
        placeholder="항목을 입력하세요."
        id={`item-${id}`}
        className={`${CreateTableStyle.input} ${error ? CreateTableStyle.inputError : ''}`}
        onKeyDown={(e) => onKeyDown(e, id)}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onChange={onChange}
        autoComplete="off"
      />
      {handleDelete && containerRef && setCount && (
        <button
          onClick={() => handleDelete(id, containerRef, setCount)}
          className={`${CreateTableStyle.button} bg-red-500 hover:bg-red-600`}
        >
          ⏤
        </button>
      )}
    </div>
    {error && <p className={CreateTableStyle.errorText}>{error}</p>}
  </div>
);
