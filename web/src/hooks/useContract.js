import { useEffect, useState } from 'react';
import { abi } from '../utils/MyEpicGame.json';
import { ethers } from 'ethers';

export const useContract = () => {
  const CONTRACT_ADDRESS = '0x047A42ef33E44628D6149023324BB82fb9f14d6a';
  const [gameContract, setGameContract] = useState(null);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, [window.ethereum]);

  const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      attackDamage: characterData.attackDamage.toNumber(),
    };
  };

  return { gameContract, transformCharacterData };
};
