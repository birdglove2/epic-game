import './Components/Arena/Arena.css';
import { useState, useEffect } from 'react';
import './App.css';
import SelectCharacter from 'Components/SelectCharacter';
import LoadingIndicator from 'Components/LoadingIndicator';
import Arena from 'Components/Arena';
import { useContract, useAccount, useNetwork } from 'hooks';
import { PokemonCanvas } from 'canvas';
import { Footer } from 'Components/Footer';

const App = () => {
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentAccount, connectWallet } = useAccount();
  const { checkNetwork } = useNetwork();
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
    <>
      <div className="text-center justify-center">
        {checkNetwork()}
        <div className="flex flex-col justify-center items-center mx-5 sm:mx-10 3xl:mx-1/10 4xl:mx-1/6 5xl:mx-1/5 mb-20 my-10">
          <div>
            <div className="p-4 mb-5">
              <p className="text-6xl font-bold mb-2">⚔️ Pokeverse ⚔️</p>
              <p className="text-2xl italic font-bold mb-2">
                Team up to protect the Pokemon world!
              </p>
              <p className="text-2xl font-bold">(╯°□°)╯︵◓</p>
            </div>

            <div className="w-110 min-w-full h-110">
              <PokemonCanvas />
            </div>
            {/* <img src="https://wallpaperaccess.com/full/109332.jpg" alt="first img" /> */}
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default App;
