import { abi } from '../utils/MyEpicGame.json';
import { ethers } from 'ethers';

export const useContract = () => {
  const CONTRACT_ADDRESS = '0xECF765F923Ac195D7453Ff2C07d6b223239Fe6e8';
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractInterface = new ethers.utils.Interface(abi);
  const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractInterface, signer);
  return { gameContract };
};
