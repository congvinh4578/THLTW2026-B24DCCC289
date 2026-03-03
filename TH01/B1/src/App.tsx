import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [secretNumber, setSecretNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [attemptsLeft, setAttemptsLeft] = useState<number>(10);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(randomNum);
    setGuess('');
    setMessage('Mình đã chọn một số từ 1 đến 100. Bạn có 10 lượt đoán!');
    setAttemptsLeft(10);
    setGameOver(false);
    setHasWon(false);
    console.log('Secret number (for debugging):', randomNum); 
  };

  const handleGuess = () => {
    if (gameOver) return;

    const numGuess = parseInt(guess.trim(), 10);

    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setMessage('Vui lòng nhập số nguyên từ 1 đến 100!');
      return;
    }

    setAttemptsLeft((prev) => prev - 1);

    if (numGuess === secretNumber) {
      setMessage(`🎉 CHÚC MỪNG! Bạn đã đoán đúng số ${secretNumber}`);
      setGameOver(true);
      setHasWon(true);
    } else if (numGuess < secretNumber) {
      setMessage('→ Bạn đoán QUÁ THẤP!');
    } else {
      setMessage('→ Bạn đoán QUÁ CAO!');
    }

    setGuess('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div className="app">
      <div className="game-container">
        <h1>Đoán Số</h1>
        <p className="subtitle">
          Số bí mật nằm trong khoảng <strong>1 – 100</strong>
        </p>

        <div className="status">
          <p className="message">{message}</p>
          <p className="attempts">
            Còn lại: <strong>{attemptsLeft}</strong> lượt
          </p>
        </div>

        {!gameOver && (
          <div className="input-area">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập số bạn đoán..."
              disabled={gameOver}
              autoFocus
            />
            <button onClick={handleGuess} disabled={gameOver || !guess.trim()}>
              Đoán
            </button>
          </div>
        )}

        {gameOver && (
          <div className="result">
            {hasWon ? (
              <h2 className="win">🎉 Bạn thắng rồi!</h2>
            ) : (
              <h2 className="lose">
                Hết lượt! Số bí mật là: <span>{secretNumber}</span>
              </h2>
            )}
            <button className="play-again" onClick={resetGame}>
              Chơi lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;