import { useEffect, useState } from 'react';
import MyEpicGame from 'contract/MyEpicGame.json';
import { ethers } from 'ethers';

export const useContract = () => {
  // v1 contract address
  // const CONTRACT_ADDRESS = '0x047A42ef33E44628D6149023324BB82fb9f14d6a';

  // v2
  // const CONTRACT_ADDRESS = '0x208F0A6500DDf63E959E2B933C16Bdf7e19e26D9';

  // v3
  const CONTRACT_ADDRESS = '0xDA22e87906b085A99256554E7B3F4cB64B985c86';

  const [gameContract, setGameContract] = useState(null);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicGame.abi, signer);

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
