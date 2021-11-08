import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import NFTGameABI from "../utilities/NFTGameABI.json"
import { CONTRACT_ADDRESS, transformCharacterData }  from '../utilities/constants.js';

import LandingPage from './LandingPage';
import SelectCharacter from './SelectCharacter';

function Main() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [loggedMessage, setLoggedMessage] = useState("");
    const [characterNFT, setCharacterNFT] = useState(null);
    
    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    /* Check if user already has a NFT minted? */
    useEffect(() => {
        /* The function we will call that interacts with out smart contract  */
        const fetchNFTMetadata = async () => {
        console.log('Checking for Character NFT on address:', currentAccount);
    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            NFTGameABI.abi,
            signer
        );
    
        const txn = await gameContract.checkIfUserHasNFT();
        if (txn.name) {
            console.log('User has character NFT');
            setCharacterNFT(transformCharacterData(txn));
        } else {
            console.log('No character NFT found');
        }
        };
    
        /*
        * We only want to run this, if we have a connected wallet
        */
        if (currentAccount) {
        console.log('CurrentAccount:', currentAccount);
        fetchNFTMetadata();
        }
    }, [currentAccount]);

    //Check we have access to the ethereum.window object
    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
            console.log('Make sure you have MetaMask!');
            
            return;
            } else {
            console.log('We have the ethereum object', ethereum);

            /*
                * Check if we're authorized to access the user's wallet
                */
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            /*
                * User can have multiple authorized accounts, we grab the first one if its there!
                */
            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log('Found an authorized account:', account);
                setCurrentAccount(account);
            } else {
                console.log('No authorized account found');
                setLoggedMessage("Go on connect your wallet!")
            }
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Decide what to render!
    const renderContent = () => {
        /* Scenario #1 */
        if (!currentAccount) {
        return (
        <>
            <LandingPage />
            <p className="text-xl mt-4 p-4">{loggedMessage}</p>
            <button onClick={connectWallet} className="mt-4 w-2/6 p-4 bg-gradient-to-r from-yellow-400 to-red-600 text-2xl font-bold rounded transform transition-all hover:scale-125 duration-500 ease-out">
                Connect Wallet!
            </button>
        </>  
        );
    } else if (currentAccount && !characterNFT) {
        return (
        <>
            <SelectCharacter setCharacterNFT={setCharacterNFT} />
            <p className="text-xl mt-4 p-4">{loggedMessage}</p>
            <button onClick={askContractToMintNFT} className="mt-4 w-2/6 p-4 bg-gradient-to-r from-purple-700 to-blue-700 text-2xl font-bold rounded transform transition-all hover:scale-125 duration-500 ease-out">
                Select Your Character
            </button> 
        </>
        )
      }
    };

    // Implement connectWallet method 
    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if(!ethereum){
                alert("Get MetaMask!")
                return;
            }

            // Fancy method to request access to account
            const accounts = await ethereum.request({
                method: "eth_requestAccounts"
            })

            //Boom! This should print out public address once we authorize Metamask
            console.log("connected", accounts[0])
            
            // Set State please?
            setCurrentAccount(accounts[0])

            // Setup Event Listener
            setupEventListener()
        } catch(error){
            console.log(error)
        }
    }

    // Request the contract
    const askContractToMintNFT = async () => {
        //Be sure to change this variable to the deployed contract address of your latest deployed contract
            try{
                const { ethereum } = window;

                if(ethereum){
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, NFTGameABI.abi, signer)

                    console.log("Going to pop wallet now to pay gas...")
                    let nftTxn = await connectedContract.makeAnEpicNFT();

                    console.log("Mining...please wait.")
                    await nftTxn.wait();

                    console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error){
                console.log(error)
            }
        }
        
        // Notify user of there new address
        const setupEventListener = async () => {
            try{
                // Most of this looks the same as our function askContractToMintNft
                const { ethereum } = window;
                
                // Same stuff again
                if (ethereum){
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner();
                    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, NFTGameABI.abi, signer)
                

                    //https://docs.ethers.io/v5/api/contract/contract/ you need to set up an event dummy
                    const selectNFT = contract.methods.setDesiredNFT(NFT).call()
                    
                    selectNFT.then((res) => {
                        console.log(res)
                    })

                    // THIS IS THE MAGIC SAUCE
                    // This will essentially "capture our event when our contract throws it"
                    connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
                        console.log(from, tokenId.toNumber())
                        let message = `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
                        setLoggedMessage(message)
                    });
                    console.log("Setup event listener!")
                } else {
                    console.log("Ethereum object doesn't exist");
                } 
            } catch (error){
                console.log(error)
            }
        }
    
    return (
      <main className="w-full text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <p className="bg-gradient-to-r from-yellow-400 to-red-400 text-transparent bg-clip-text text-6xl leading-relaxed"> Ancient Egyptian NFT's! </p>
        </h1>
        
        {renderContent()}

      </main>
    );
}

export default Main