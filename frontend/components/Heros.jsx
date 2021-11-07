import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import herosABI from "../utilities/Heros.json"

function Main() {
    const data = ["Amun", "Ra", "Seshat", "Tutankhamun", "Hapi"]

    const [currentAccount, setCurrentAccount] = useState("");
    const [loggedMessage, setLoggedMessage] = useState("Go on connect your wallet!");
    const [selectedNFT, setSelectedNFT] = useState("");
    
    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    //Check we have access to the ethereum.window object
    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if(!ethereum){
            console.log("Make sure you have metamask!")
            return;
        } else {
            console.log("We have the ethereum object", ethereum)
        }
        //Check if we're authorized to access the users wallet
        const accounts = await ethereum.request({ method: 'eth_accounts'});

        //Users can have multiple authorized accounts, we grab the first one if its there!
        if(accounts.length !== 0){
            const account = accounts[0]
            console.log("Found an authorized account:", account)
            setCurrentAccount(account)
        } else {
            console.log("No authorized account found")
        }
    }

    // Implement connectWallet method 
    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if(!ethereum){
                alert("Get MetaMask!")
                return;
            }

            // Fancy method to request access to account
            const accounts = await ethereum.request({ method: "eth_requestAccounts"})

            //Boom! This should print out public address once we authorize Metamask
            console.log("connected", accounts[0])
            
            // Set State please?
            setCurrentAccount(accounts[0])
            let message = "Cool your've connected your wallet - please select the NFT you would like to mint!"
            setLoggedMessage(message)
            // Setup Event Listener
            setupEventListener()
        } catch(error){
            console.log(error)
        }
    }
    // Select the NFT to mint
    const selectWhichNFT = async (NFT) => {
        // This is just state
        setSelectedNFT(NFT)
        let message = `Awsome you have selected ${NFT} - If your happy with your selection - go ahead and mint your NFT!`
        setLoggedMessage(message)
    }


    // Request the contract
    const askContractToMintNFT = async () => {
        //Be sure to change this variable to the deployed contract address of your latest deployed contract
        const CONTRACT_ADDRESS = "0xFD8Dde5fB524590D3d67BD858e50512Af3194Fea"
            try{
                const { ethereum } = window;

                if(ethereum){
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNFT.abi, signer)

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
            const CONTRACT_ADDRESS = "0xFD8Dde5fB524590D3d67BD858e50512Af3194Fea"
            try{
                // Most of this looks the same as our function askContractToMintNft
                const { ethereum } = window;
                
                // Same stuff again
                if (ethereum){
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner();
                    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, herosABI.abi, signer)
                

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
        


    // We conditialnal render if wallet is connected or not
    return (
      <main className="w-full text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <p className="bg-gradient-to-r from-yellow-400 to-red-400 text-transparent bg-clip-text text-6xl leading-relaxed">Ancient Egyptian NFT's!</p>
        </h1>

        <div className="p-4 font-bold text-xl">
            <p>Each unique. Each beutiful.</p>
        </div>

        {/*Obviously should map this*/}
        <div className="grid grid-cols-5 divide-x divide-yellow-400 justify-items-center ">
            <div onClick={() => selectWhichNFT(`${data[0]}`)} className="h-full w-full grid justify-items-center items-end hover:cursor-pointer hover:bg-gradient-radial from-yellow-400 to-red-400">
                <img  className="h-auto w-2/6 filter hover:drop-shadow-red" src={`/img/svg/${data[0]}.svg`} />
            </div>
            <div onClick={() => selectWhichNFT(`${data[1]}`)} className="h-full w-full grid justify-items-center items-end hover:cursor-pointer hover:bg-gradient-radial from-yellow-400 to-red-400">
                <img className="h-auto w-2/6 filter hover:drop-shadow-yellow" src={`/img/svg/${data[1]}.svg`} />
            </div>
            <div onClick={() => selectWhichNFT(`${data[2]}`)} className="h-full w-full grid justify-items-center items-end hover:cursor-pointer hover:bg-gradient-radial from-yellow-400 to-red-400">
                <img className="h-auto w-2/6 filter hover:drop-shadow-pink" src={`/img/svg/${data[2]}.svg`} />
            </div>
            <div onClick={() => selectWhichNFT(`${data[3]}`)} className="h-full w-full grid justify-items-center items-end hover:cursor-pointer hover:bg-gradient-radial from-yellow-400 to-red-400">
                <img className="h-auto w-2/6 filter hover:drop-shadow-green" src={`/img/svg/${data[3]}.svg`} />
            </div>
            <div onClick={() => selectWhichNFT(`${data[4]}`)} className="h-full w-full grid justify-items-center items-end hover:cursor-pointer hover:bg-gradient-radial from-yellow-400 to-red-400">
                <img className="h-auto w-2/6 filter hover:drop-shadow-blue" src={`/img/svg/${data[4]}.svg`} />
            </div>
        </div>

        <p className="text-xl mt-4 p-4">{loggedMessage}</p>

        {currentAccount === "" ? (
        <button onClick={connectWallet} className="mt-4 w-2/6 p-4 bg-gradient-to-r from-yellow-400 to-red-600 text-2xl font-bold rounded transform transition-all hover:scale-125 duration-500 ease-out">
            Connect Wallet!
        </button>
        ) : (
        <>
        <button onClick={askContractToMintNFT} className="mt-4 w-2/6 p-4 bg-gradient-to-r from-purple-700 to-blue-700 text-2xl font-bold rounded transform transition-all hover:scale-125 duration-500 ease-out">
            Mint NFT!
        </button> 
        </>
        )}

      </main>
    );
}

export default Main