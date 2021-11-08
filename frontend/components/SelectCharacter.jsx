import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../utilities/constants.js';
import NFTGameABI from '../utilities/NFTGameABI.json';

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  //As soon as our component is mounted, we are going to want to create our gameContract to start using right away! We want to display our mint-able characters as soon as possible.
  useEffect(() => {
    const { ethereum } = window;
  
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTGameABI.abi,
        signer
      );
  
      /*
       * This is the big difference. Set our gameContract in state.
       */
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  //Fetching the Characters
  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');
  
        /*
         * Call contract to get all mint-able characters
         */
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);
  
        /*
         * Go through all of our characters and transform the data
         */
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );
  
        /*
         * Set all mint-able characters in state
         */
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };
  
    /*
     * If our gameContract is ready, let's get characters!
     */
    if (gameContract) {
      getCharacters();
    }
  }, [gameContract]);

    // Render Methods
  const renderCharacters = () =>
  characters.map((character, index) => (
    <div className="bg-black" key={character.name}>
      <div className="flex justify-center items-center w-60 h-60">
      <img 
        className="h-5/6 w-2/6 filter drop-shadow-green transform scale-110"
        src={character.imageURI}
        alt={character.name}
      />
      </div>
      <div className="w-full h-1/6 bg-blue-500 ">
        <p>{character.name}</p>
      </div>
      <button
        type="button"
        className="w-full h-1/6 bg-green-500 "
        //onClick={mintCharacterNFTAction(index)}
      >{`Mint ${character.name}`}</button>
    </div>
  ));

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      
      {/* Only show this when there are characters in state */}
        {characters.length > 0 && (
          <div className="grid grid-cols-3 gap-6 justify-items-center">{renderCharacters()}</div>
        )}
      </div>
  );
};

export default SelectCharacter;

//transform -scale-x-1