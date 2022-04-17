import { useState, useEffect } from 'react';
import twitterLogo from 'assets/twitter-logo.svg';
import githubLogo from 'assets/GitHub-Mark-32px.png';
import './App.css';
import SelectCharacter from 'Components/SelectCharacter';
import LoadingIndicator from 'Components/LoadingIndicator';
import Arena from 'Components/Arena';
import { useContract, useAccount } from 'hooks';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const GITHUB_LINK = 'https://github.com/birdglove2/turn-based-nft-card-game';

const App = () => {
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentAccount, connectWallet } = useAccount();
  const { gameContract, transformCharacterData } = useContract();

  useEffect(() => {
    console.log('game contract', gameContract);
    const fetchNFTMetadata = async () => {
      console.log(`Checking for Character NFT on: https://testnets.opensea.io/${currentAccount}`);

      const txn = await gameContract.getUserNFT(currentAccount);
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
  }, [currentAccount, gameContract, isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <button
          className="text-xl font-bold m-5 py-5 px-20 rounded-xl bg-red-500 hover:bg-red-800"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setIsLoading={setIsLoading} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  return (
    <div className="text-center justify-center">
      <div className="flex flex-col justify-center items-center mx-5 sm:mx-10 3xl:mx-1/10 4xl:mx-1/6 5xl:mx-1/5 mb-20 my-10">
        <div>
          <div className="p-4 mb-5">
            <p className="text-6xl font-bold mb-2">⚔️ Pokeverse ⚔️</p>
            <p className="text-2xl italic font-bold mb-2">Team up to protect the Pokemon world!</p>
            <p className="text-2xl font-bold">(╯°□°)╯︵◓</p>
          </div>
          <img src="https://wallpaperaccess.com/full/109332.jpg" alt="first img" />

          {renderContent()}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={GITHUB_LINK}
          className="flex justify-center items-center"
        >
          <img alt="Github Logo" className="w-9 h-9 mr-2" src={githubLogo} />
          <p className="text-sm font-bold">visit the code</p>
        </a>

        <div className="flex justify-center items-center">
          <img alt="Twitter Logo" className="w-9 h-9" src={twitterLogo} />
          <a
            className="text-sm font-bold"
            href={TWITTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
