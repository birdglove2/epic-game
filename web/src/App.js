import React, { useState, useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import LoadingIndicator from './Components/LoadingIndicator';
import Arena from './Components/Arena';
import { useContract } from './hooks/useContract';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { gameContract, transformCharacterData } = useContract();

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '4') {
        alert('Please connect to Rinkeby!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      setIsLoading();
      await checkIfWalletIsConnected();
      await checkNetwork();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    console.log('game contract', gameContract);
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has character NFT');
        const character = transformCharacterData(txn);
        setCharacterNFT(character);
        console.log('characterNFT: ', character);
      } else {
        console.log('No character NFT found');
      }
      setIsLoading(false);
    };

    if (currentAccount && gameContract) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount, gameContract]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <button className="cta-button connect-wallet-button" onClick={connectWallet}>
          Connect to Wallet
        </button>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Pokeverse ⚔️</p>
          <p className="sub-text">Team up to protect the Pokemon world!</p>

          <div className="connect-wallet-container">
            <img src="https://wallpaperaccess.com/full/109332.jpg" alt="first img" />
          </div>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
