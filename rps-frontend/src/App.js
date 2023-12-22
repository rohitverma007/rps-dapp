import React, { useState, useEffect } from 'react';
import { isAllowed, setAllowed, getUserInfo } from '@stellar/freighter-api';
import { Contract, networks } from 'rps_contract-client';
import './App.css'; // Ensure this line is uncommented

function App() {
  const [publicKey, setPublicKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gameResult, setGameResult] = useState('');

  useEffect(() => {
    async function checkFreighter() {
      if (await isAllowed()) {
        const userInfo = await getUserInfo();
        if (userInfo && userInfo.publicKey) {
          setPublicKey(userInfo.publicKey);
          setIsLoggedIn(true);
        } else {
          console.log('Freighter is locked. Sign in & refresh the page.');
        }
      }
    }
    checkFreighter();
  }, []);

  const handleLogin = async () => {
    await setAllowed();
    const userInfo = await getUserInfo();
    if (userInfo && userInfo.publicKey) {
      setPublicKey(userInfo.publicKey);
      setIsLoggedIn(true);
    }
  };

  const playGame = async (playerChoice) => {
    try {
      const rpsContract = new Contract({
        ...networks.testnet,
        rpcUrl: 'https://soroban-testnet.stellar.org',
      });
      const tx = await rpsContract.play({ player_choice: playerChoice });
      const { result } = await tx.signAndSend();
      console.log(result)
      // 0 = draw, 1 = player win, 2 = contract win
      if (result === 2n) {
        setGameResult(`Contract Won!`);
      } else if (result === 1n) {
        setGameResult(`You Won!`);
      } else {
        setGameResult(`Draw!`);
      }
    } catch (e) {
      console.error(e);
      setGameResult(`Error: ${e.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Rock Paper Scissors Game</h1>
      {isLoggedIn ? (
        <div className="game-container">
          <p className="user-info">Signed in as {publicKey}</p>
          <div className="game-buttons">
            <button className="game-btn" onClick={() => playGame(1)}>Rock</button>
            <button className="game-btn" onClick={() => playGame(2)}>Paper</button>
            <button className="game-btn" onClick={() => playGame(3)}>Scissors</button>
          </div>
          <p className="game-result">{gameResult}</p>
        </div>
      ) : (
        <button className="login-btn" onClick={handleLogin}>Connect</button>
      )}
    </div>
  );
}

export default App;
