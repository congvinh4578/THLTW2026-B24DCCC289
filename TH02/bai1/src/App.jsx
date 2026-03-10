import React, { useState } from 'react';
function App() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const choices = {
    bua: { name: 'Búa', emoji: '✊' },
    keo: { name: 'Kéo', emoji: '✂️' },
    bao: { name: 'Bao', emoji: '✋' },
  };
  const play = (choice) => {
    setPlayerChoice(choice);
    const compChoices = ['bua', 'keo', 'bao'];
    const comp = compChoices[Math.floor(Math.random() * 3)];
    setComputerChoice(comp);

    let res = '';
    if (choice === comp) {
      res = 'Hòa';
    } else if (
      (choice === 'bua' && comp === 'keo') ||
      (choice === 'keo' && comp === 'bao') ||
      (choice === 'bao' && comp === 'bua')
    ) {
      res = 'Thắng';
    } else {
      res = 'Thua';
    }
    setResult(res);

    const entry = {
      player: choices[choice],
      computer: choices[comp],
      result: res,
    };
    setHistory((prev) => [...prev, entry]);
  };
  const resetHistory = () => {
    setHistory([]);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
  };

  return (
    <div
      style={{
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        background: '#f8f9fa',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ color: '#333', marginBottom: '30px' }}>🎮 Oẳn Tù Tì 🎮</h1>
      <div style={{ fontSize: '24px', margin: '20px 0' }}>
        <button
          onClick={() => play('bua')}
          style={{
            fontSize: '48px',
            margin: '10px',
            padding: '20px 15px',
            border: 'none',
            background: '#ff6b6b',
            color: 'white',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {choices.bua.emoji}
          <br />
          <small>{choices.bua.name}</small>
        </button>
        <button
          onClick={() => play('keo')}
          style={{
            fontSize: '48px',
            margin: '10px',
            padding: '20px 15px',
            border: 'none',
            background: '#4ecdc4',
            color: 'white',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {choices.keo.emoji}
          <br />
          <small>{choices.keo.name}</small>
        </button>
        <button
          onClick={() => play('bao')}
          style={{
            fontSize: '48px',
            margin: '10px',
            padding: '20px 15px',
            border: 'none',
            background: '#45b7d1',
            color: 'white',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {choices.bao.emoji}
          <br />
          <small>{choices.bao.name}</small>
        </button>
      </div>
      {playerChoice && (
        <div
          style={{
            fontSize: '28px',
            margin: '30px 0',
            padding: '20px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <strong>Bạn:</strong> {choices[playerChoice].emoji} (
            {choices[playerChoice].name})
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Máy:</strong> {choices[computerChoice].emoji} (
            {choices[computerChoice].name})
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color:
                result === 'Thắng'
                  ? '#27ae60'
                  : result === 'Thua'
                    ? '#e74c3c'
                    : '#f39c12',
            }}
          >
            {result}!
          </div>
        </div>
      )}
      <button
        onClick={resetHistory}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          border: 'none',
          background: '#e74c3c',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        disabled={history.length === 0}
      >
        🗑️ Xóa Lịch Sử ({history.length} ván)
      </button>
      <h2 style={{ color: '#555', marginBottom: '20px' }}>📜 Lịch Sử</h2>
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          textAlign: 'left',
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          minHeight: '100px',
        }}
      >
        {history.length === 0 ? (
          <p
            style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}
          >
            Chưa có ván đấu nào! Chơi ngay để xem lịch sử nhé! 🎯
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {history
              .slice()
              .reverse()
              .map((entry, index) => (
                <li
                  key={index}
                  style={{
                    padding: '15px',
                    borderBottom: '1px solid #eee',
                    fontSize: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>
                    {entry.player.emoji} <strong>{entry.player.name}</strong> vs
                    {entry.computer.emoji}{' '}
                    <strong>{entry.computer.name}</strong>
                  </span>
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color:
                        entry.result === 'Thắng'
                          ? '#27ae60'
                          : entry.result === 'Thua'
                            ? '#e74c3c'
                            : '#f39c12',
                      minWidth: '80px',
                    }}
                  >
                    {entry.result}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
