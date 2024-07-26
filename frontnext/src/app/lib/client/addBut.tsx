import React, { useRef, useState } from 'react';

export const AddBut: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = (id: number): void => {
    const element = document.getElementById(`set-${id}`);
    if (element) {
      element.remove();
    }
  };

  const handleClick = (): void => {
    const id = count + 1;
    const newSet = document.createElement('div');
    newSet.id = `set-${id}`;
    newSet.style.display = 'flex';
    newSet.style.alignItems = 'center';
    newSet.style.marginBottom = '10px';

    // Label 생성 및 추가
    const label = document.createElement('span');
    label.textContent = `항목 ${id}`;
    newSet.appendChild(label);

    // Input 생성 및 추가
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '내용을 입력하세요.';
    input.id = `item-${id}`;
    newSet.appendChild(input);

    // Button 생성 및 추가
    const button = document.createElement('button');
    button.textContent = '항목 삭제';
    button.onclick = () => handleDelete(id);
    newSet.appendChild(button);

    // 컨테이너에 새로운 세트 추가
    if (containerRef.current) {
      containerRef.current.appendChild(newSet);
    }

    setCount(id);
  };

  return (
    <div>
      <button onClick={handleClick}>항목 추가</button>
      <div ref={containerRef}></div>
    </div>
  );
};
