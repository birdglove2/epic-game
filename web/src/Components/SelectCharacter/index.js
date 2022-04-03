import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { useContract } from '../../hooks/useContract';

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const { gameContract, transformCharacterData } = useContract();

  const mintCharacterNFTAction = async (characterId) => {
    console.log('heelo ', characterId);
    try {
      if (gameContract) {
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
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
          <img src={character.imageURI} alt={character.name} />
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
      {characters.length > 0 && <div className="character-grid">{renderCharacters()}</div>}
    </div>
  );
};

export default SelectCharacter;
