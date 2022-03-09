import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESS,
  transformCharacterData,
} from "../utilities/constants.js";
import NFTGameABI from "../utilities/NFTGameABI.json";

/*We pass in our characterNFT metadata so we can show a cool card in our UI */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [overBoss, setBossOver] = useState(false);
  const [overChar, setCharOver] = useState(false);

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

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  //Fetch Boss data from contract
  useEffect(() => {
    /* Setup async function that will get the boss from our contract and sets in state*/
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformCharacterData(bossTxn));
    }

    /* Setup logic when this event is fired off */
    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /* Update both player and boss Hp */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      })

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      })
    }
  
    if (gameContract) {
      /*gameContract is ready to go! Let's fetch our boss*/
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
    }

    /* Make sure to clean up this event when this component is removed*/
      return () => {
        if (gameContract) {
          gameContract.off('AttackComplete', onAttackComplete);
        }
      }
    }, [gameContract]);

  // Actions
  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setCharOver(true)
        console.log('Attacking boss...');
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setCharOver(false)
      }
    } catch (error) {
      console.error('Error attacking boss:', error);
    }
  };

  return (
    <>
      <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-red-900 text-transparent bg-clip-text leading-relaxed">
        Prepare to fight!
      </h1>
      <div className="flex w-full justify-center">
        <div className="flex justify-between max-w-7xl pt-20 space-x-60 items-end">
          {/* Character NFT */}
          {characterNFT && (
            <div>

              <div className="flex justify-center w-full">
                <img
                  className="py-10 h-84 transform -scale-x-1 filter drop-shadow-pink"
                  onMouseOver={() => setCharOver(true)}
                  onMouseOut={() => setCharOver(false)}
                  src={characterNFT.imageURI}
                />
              </div>
              <div>
              <h2 className="text-3xl py-5">{characterNFT.name}</h2>
                <progress
                  className="w-full h-7"
                  value={characterNFT.hp}
                  max={characterNFT.maxHp}
                />
                <p className="text-xl pb-2">{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
          )}
          {/* BOSS */}
          {boss && (
            <div>
              <div className="flex justify-center">
                <img 
                  className='absolute z-50 -ml-20'
                  src={overChar ? "lightning.png" : ''} alt="" 
                />
                <img 
                  className='absolute -ml-80 -mt-24 rotate-45'
                  src={overBoss ? "fire.png" : ''} alt="" 
                />
                <img
                  className="py-10 h-84 transform filter drop-shadow-pink"
                  onMouseOver={() => setBossOver(true)}
                  onMouseOut={() => setBossOver(false)}
                  src={overBoss ? "Ammit1.png" : boss.imageURI}
                />
              </div>
              <div>
              <h2 className="text-3xl py-5">Ammit</h2> {/* {boss.name} */}
                <progress
                  className="w-full h-7"
                  value={boss.hp}
                  max={boss.maxHp}
                />
                <p className="text-xl pb-2">{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <button     
        className="w-3/6 p-4 border border-red-600 text-3xl font-bold rounded hover:bg-red-900 mt-20"
        onClick={runAttackAction}>
            {` Attack ${boss ? boss.name : ''} 💥`}
      </button>
    </>
  );
};

export default Arena;