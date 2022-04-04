import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { useContract } from '../../hooks/useContract';
import '../LoadingIndicator';
import LoadingIndicator from '../LoadingIndicator';

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const { gameContract, transformCharacterData } = useContract();
  const [mintingCharacter, setMintingCharacter] = useState(false);

  const mintCharacterNFTAction = async (characterId) => {
    console.log('heelo ', characterId);
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
      setMintingCharacter(true);
    }
  };

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');

        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);

        const characters = charactersTxn.map((charactersData) => {
          return transformCharacterData(charactersData);
        });

        setCharacters(characters);
      } catch (err) {
        console.error('Something went wrong fetching characters');
      }
    };

    // event listener
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      /*
       * Once our character NFT is minted we can fetch the metadata from our contract
       * and set it in state to move onto the Arena
       */
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNFT: ', characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
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
        <div className="character-item" key={character.name}>
          <div className="name-container">
            <p>{character.name}</p>
          </div>
          <img
            src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}
            alt={character.name}
          />
          <button
            style={{ border: '1px solid red', cursor: 'pointer', zIndex: 2 }}
            className="character-mint-button"
            onClick={() => mintCharacterNFTAction(index)}
          >{`Mint ${character.name}`}</button>
        </div>
      );
    });
  };

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
      {characters.length > 0 && <div className="character-grid">{renderCharacters()}</div>}
    </div>
  );
};

export default SelectCharacter;
