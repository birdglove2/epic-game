import React, { useEffect, useState } from 'react';
import './Arena.css';
import { useContract } from '../../hooks/useContract';
import LoadingIndicator from '../LoadingIndicator';
import HealthBar from 'Components/HealthBar';
import PokemonCard from 'Components/PokemonCard';
import BossCard from 'Components/BossCard';

const Arena = ({ characterNFT, setCharacterNFT }) => {
  const { gameContract, transformCharacterData } = useContract();
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const attackAnimate = async () => {
    setAttackState('attacking');
    await sleep(500);
    setAttackState('hit');
    await sleep(500);
  };

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        await attackAnimate();
        console.log('Attacking boss...');
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error attacking boss:', error);
    } finally {
      setAttackState('AttackCompleted');
    }
  };

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    const onAttackComplete = (newBossHp, newPlayerHp, _damage, critChance) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();
      const damage = _damage.toNumber();

      let msg = '';
      if (critChance >= 8) {
        msg = `💥 CRITICAL HIT! Triple Damage, ${boss.name} was hit for ${damage}!`;
      } else if (critChance >= 5) {
        msg = `💥 CRITICAL HIT! Double Damage, ${boss.name} was hit for ${damage}!`;
      } else {
        msg = `💥 ${boss.name} was hit for ${damage}!`;
      }
      setToastMessage(msg);

      console.log(msg);
      console.log(`AttackComplete - BossHp: ${bossHp} Player Hp: ${playerHp}`);

      setBoss((prevState) => ({ ...prevState, hp: bossHp }));
      setCharacterNFT((prevState) => ({ ...prevState, hp: playerHp }));
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
    }

    return () => {
      if (gameContract) {
        gameContract.off('AttackComplete', onAttackComplete);
      }
    };
  }, [gameContract]);

  return (
    <div className="flex flex-col items-center mt-10">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? 'show' : ''}>
          <div id="desc">{toastMessage}</div>
        </div>
      )}
      {boss && (
        <div className="flex flex-col justify-around mb-12">
          <BossCard attackState={attackState} boss={boss} />
          {attackState === 'AttackInitiated' && (
            <div className="mt-10">
              <LoadingIndicator />
              <p>Attacking... ⚔️</p>
            </div>
          )}
        </div>
      )}

      {boss && characterNFT && (
        <>
          <button
            disabled={attackState === 'attacking' || characterNFT.hp === 0}
            className={`text-xl font-bold w-96 mb-10 py-5 px-20 rounded-xl ${
              attackState === 'attacking' || characterNFT.hp === 0
                ? 'bg-gray-500'
                : 'bg-red-800 hover:bg-red-900'
            }`}
            onClick={runAttackAction}
          >
            {`💥 Attack 💥 `}
          </button>
          {characterNFT.hp === 0 && (
            <button
              className={`text-xl font-bold w-96 mb-10 py-5 px-20 rounded-xl bg-orange-500 hover:bg-orange-900`}
              onClick={runReviveAction}
            >
              {` Revive `}
            </button>
          )}
        </>
      )}

      {characterNFT && <PokemonCard attackState={attackState} character={characterNFT} />}
    </div>
  );
};

export default Arena;
