import { useEffect, useState } from 'react';
import MyEpicGame from 'contract/MyEpicGame.json';
import { ethers } from 'ethers';

export const useContract = () => {
  // v1 contract address
  // const CONTRACT_ADDRESS = '0x047A42ef33E44628D6149023324BB82fb9f14d6a';

  // v2
  const CONTRACT_ADDRESS = '0x5E322636F837A38e16D6F202e10629AAcECA258c';

  const [gameContract, setGameContract] = useState(null);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicGame.abi, signer);

      setGameContract(gameContract);
      console.log(`See contract at https://rinkeby.etherscan.io/address/${CONTRACT_ADDRESS}`);
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
