import { useEffect, useState } from 'react';
import { useContract } from 'hooks';
import '../LoadingIndicator';
import LoadingIndicator from '../LoadingIndicator';

const SelectCharacter = ({ setIsLoading }) => {
  const [characters, setCharacters] = useState([]);
  const { gameContract, transformCharacterData } = useContract();
  const [mintingCharacter, setMintingCharacter] = useState(false);

  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...');
        setMintingCharacter(true);
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    } finally {
      setMintingCharacter(false);
    }
  };

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');
        const charactersTxn = await gameContract.getDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);
        const characters = charactersTxn.map((charactersData) => {
          return transformCharacterData(charactersData);
        });

        setCharacters(characters);
      } catch (err) {
        console.error('Something went wrong fetching characters', err.message);
      }
    };

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );
      setIsLoading(true);
    };

    if (gameContract) {
      getCharacters();
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
    };
  }, [gameContract]);

  const renderCharacters = () => {
    return characters.map((character, index) => {
      return (
        <div
          className="flex flex-col relative justify-self-center self-center mb-10"
          key={character.name}
        >
          <div className="absolute bg-gray-400 m-2 rounded-lg">
            <p className="my-2 mx-4 font-bold">{character.name}</p>
          </div>
          <div className="my-5">
            <img
              className="h-[300px] w-[350px] object-cover"
              src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}
              alt={character.name}
            />
          </div>
          <button
            className="w-full h-[40px] bottom-0 bg-green-300 rounded-[20px] border-none cursor-pointer font-bold text-md"
            onClick={() => mintCharacterNFTAction(index)}
          >
            Mint
          </button>
        </div>
      );
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center mt-20">
      <h2 className="text-3xl font-bold mb-20">Mint Your Pokemon. Choose wisely.</h2>
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            className="mb-10"
            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
      {characters.length > 0 && (
        <div className="w-full items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {renderCharacters()}
        </div>
      )}
    </div>
  );
};

export default SelectCharacter;
