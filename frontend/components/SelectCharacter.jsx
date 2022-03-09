import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS,
  transformCharacterData,
} from "../utilities/constants.js";
import NFTGameABI from "../utilities/NFTGameABI.json";

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  const [selectedCharater, setSelectedCharacter] = useState("Pick your hero to take on the man-eating demon Ammit - choose wisely");
  const [characterIndex, setCharacterIndex] = useState(null);

  //Set game Characters
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

      /* This is the big difference. Set our gameContract in state.*/
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  //Fetching the Characters and listen for chnages
  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint");

        /* Call contract to get all mint-able characters*/
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);

        /* Go through all of our characters and transform the data*/
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        /* Set all mint-able characters in state*/
        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    // This method is called anytime a new character NFT is minted. 
    /* Add a callback method that will fire when this event is received*/
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      /* Once our character NFT is minted we can fetch the metadata from our contract and set it in state to move onto the Arena */
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    /* If our gameContract is ready, let's get characters!*/
    if (gameContract) {
      getCharacters();
      /* Setup NFT Minted Listener*/
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      /*When your component unmounts, lets make sure to clean up this listener*/
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    }
  }, [gameContract])

  // Actions
  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        console.log("Minting character in progress...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
        alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
    }
  };

  // Render Methods
  const renderCharacters = () =>
    characters.map((character, index) => (
      <div
        key={character.name}
        className="p-5 cursor-pointer"
        onClick={() =>
          setSelectedCharacter(`You have chosen ${character.name}`,
          setCharacterIndex(index)
          )
        }
      >
        <div className="flex justify-center items-center w-[300px] h-[600px]">
          <img
            className={`object-contain w-full h-full filter 
              ${character.name === "Ma'at" ? "drop-shadow-yellow" : ""}
              ${character.name === "Tutankhamun" ? "drop-shadow-green" : ""}
              ${character.name === "Set" ? "drop-shadow-red" : ""}
              transition transfrom ease-in-out hover:scale-[102%] 
            `}
            src={character.imageURI}
            alt={character.name}
          />
        </div>
        <div className="text-3xl w-full p-4">
          <p>{character.name}</p>
        </div>
        <p className="text-white text-3xl bg-red-500 w-full p-4">
          {`Select ${character.name}`}
        </p>
      </div>
    ));

  return (
    <>
      <h2 className="text-3xl text-yellow-300">{selectedCharater}</h2>
      <div className="flex justify-center items center ">
        {/* Only show this when there are characters in state */}
        {characters.length > 0 && (
          <div className="grid grid-cols-3 gap-6 justify-items-center p-5">
            {renderCharacters()}
          </div>
        )}
      </div>
      <button
        onClick={() => mintCharacterNFTAction(characterIndex)}
        className="w-3/6 p-4 border border-green-600 text-3xl font-bold rounded hover:bg-green-600"
      >
        Confirm Selection
      </button>
    </>
  );
};

export default SelectCharacter;