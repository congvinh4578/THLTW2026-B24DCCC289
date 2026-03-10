import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const KnowledgeBlockManager = () => {
  const [blocks, setBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('knowledgeBlocks')) || [];
    setBlocks(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('knowledgeBlocks', JSON.stringify(blocks));
  }, [blocks]);

  const addBlock = () => {
    if (newBlock) {
      setBlocks([...blocks, { id: uuidv4(), name: newBlock }]);
      setNewBlock('');
    }
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Quản Lý Khối Kiến Thức</h2>
      <input
        type="text"
        value={newBlock}
        onChange={(e) => setNewBlock(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Tên khối kiến thức mới"
      />
      <button
        onClick={addBlock}
        className="bg-green-500 text-white p-2 rounded"
      >
        Thêm
      </button>
      <ul className="mt-4">
        {blocks.map((block) => (
          <li key={block.id} className="flex justify-between mb-2">
            {block.name}
            <button
              onClick={() => deleteBlock(block.id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KnowledgeBlockManager;
