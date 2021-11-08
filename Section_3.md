# PART 1
### Getting started with React.js
Now this is where the fun REALLY starts. Writing and deploying your smart contract is one thing, but building a portal where anyone in the world can interact with the blockchain is just pure magic ✨

### Using the Ethereum object.
So, in order for our website to talk to the blockchain, we need to somehow connect our wallet to it. Once we connect our wallet to our website, our website will have permission to call smart contracts on our behalf. Remember, it's just like authenticating into a website.

Head over to your code and go to App.js under src. This is where the main entry point of our app will be.

If we're logged in to MetaMask, it will automatically inject a special object named ethereum into our window that has some magical methods. Let's check if we have that first:

```
import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Start by creating a new action that we will run on component load
   */
  // Actions
  const checkIfWalletIsConnected = () => {
    /*
     * First make sure we have access to window.ethereum
     */
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have MetaMask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
        </div>
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```
### Accessing the users account 
So when you run this, you should see that line "We have the Ethereum object" printed in the console of the website when you go to inspect it.

NICE.

Next, we need to actually check if we're authorized to actually access the user's wallet. Once we have access to this, we can call our smart contract!

Basically, Metamask doesn't just give our wallet credentials to every website we go to. It only gives it to websites we authorize. Again, it's just like logging in! But, what we're doing here is checking if we're "logged in".

Check out the code below:

```
/*
 * We are going to need to use state now! Don't forget to import useState
 */
import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
   */
  const [currentAccount, setCurrentAccount] = useState(null);

  /*
   * Since this method will take some time, make sure to declare it as async
   */
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
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

### Render connect to wallet button
When you run the above code, the console.log that prints should be No authorized account found. Why? Well because we never explicitly told Metamask, "hey Metamask, please give this website access to my wallet"

We need to create a connectWallet button. In the world of web3, connecting your wallet is literally a "Login" button for your user.

Ready for the easiest "login" experience for your life :)? Check it out:

```
import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
            {/*
             * Button that we will use to trigger wallet connect
             * Don't forget to add the onClick event to call your method!
             */}
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
            </button>
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Click your fancy new button and you should see your MetaMask Chrome extension pop up! NOICE.

# PART 2
#  Setting up the initial app state.
Now that we have access to a wallet address we can start minting character NFTs from our contract!

This section is going to help you understand how we will be rendering each state of our app. Why don't we just break down the logic real quick:

1) If user has has not connected to your app - Show Connect To Wallet Button
2) If user has connected to your app AND does not have a character NFT - Show SelectCharacter Component
3) If user has connected to your app AND does have a character NFT - Show Arena Component. The Arena is where users will be able to attack our boss!

Nice. So it looks like we have three different views we need to create! We are going to be getting into some pretty cool React.js that may be new to you. If you don't fully understand it - don't worry! Make sure to reach out to others in Discord and do some research! Remember, Google is your friend :).

# Setting up the SelectCharacter Component.
Let's start off with creating our SelectCharacter Component! Head to the src/Components/SelectCharacter folder and create a new file named index.js . This directory will hold the core logic for our SelectCharacter component as well as it's styling! You should already see a SelectCharacter.css file in there with a bunch of styling!

Oh, one thing to note - you probably see the LoadingIndicator component in the Components folder. Don't worry about that just yet, we will get to it later 🤘.

Now that we have our folder structure all setup, let's go ahead and add the base logic for a component. Start by creating a new file named index.js in your fresh SelectCharacter folder. In this folder go ahead and add the following code:

``` 
import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
    </div>
  );
};

export default SelectCharacter;
``` 

Very nice 😎. See how easy that was? You already have a component ready to go! Let's go ahead and get our conditional rendering setup so we can see this thing.

### Showing the SelectCharacter Component
We are going to need to go back to the App.js file and import our newly created component. Right under where you import your App.css file add this line:

```
import SelectCharacter from './Components/SelectCharacter';
```

You now have access to your new component! We need to add just a tad bit of fanciness here to get our component to render, though. Let's take a look at the piece of logic we are trying to account for again:

If user has connected to your app **AND** does not have a character NFT - **Show SelectCharacter Component**

We currently are holding state for whether someone has connected their wallet our not, but we don't have anything setup for knowing if someone has minted a character NFT yet!

We are going to start by creating a render function named: renderContent . This will handle all the logic for what to render. Let's start by adding this new function right under where we declared checkIfWalletIsConnected :

```
// Render Methods
const renderContent = () => {};
```

Great. Now that we have this setup, we can start adding our logic for the two scenarios we are ready to handle:

1) If user has has not connected to your app - Show Connect To Wallet Button
2) If user has connected to your app AND does not have a character NFT - Show SelectCharacter Component

```
// Render Methods
const renderContent = () => {
  /*
   * Scenario #1
   */
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
          src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
          alt="Monty Python Gif"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet To Get Started
        </button>
      </div>
    );
    /*
     * Scenario #2
     */
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  }
};
```

Oh snap 😅. Your app is probably yelling at you that characterNFT and setCharacterNFT are undefined. If you think about it, we never setup any state variables for this! This is a really easy fix - just add another state variable in App.js:

```
// State
const [currentAccount, setCurrentAccount] = useState(null);

/*
 * Right under current account, setup this new state property
 */
const [characterNFT, setCharacterNFT] = useState(null);
```

VERY NICE. We are so close. One more thing to get this thing working perfectly ✨ - calling the render method! This is as simple as replacing our button in our HTML with our render method. It should look something like this:

```
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
        <p className="sub-text">Team up to protect the Metaverse!</p>
        {/* This is where our button and image code used to be!
         *	Remember we moved it into the render method.
         */}
        {renderContent()}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built with @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
```

Note: Remember to import SelectCharacter by adding this line to the top of your file
import SelectCharacter from './Components/SelectCharacter';

### Making Stuff Work
We've done a lot! At this point, let's make sure both methods are working:

#### Scenario #1
The first scenario is the user has has not connected to our app w/ their wallet — so show them the connect to wallet button!

Note: Make sure your wallet is not connected to your app from a past project. To do this, click your MetaMask extension and click on the three dots on the right. You should then see "Connected sites". Go ahead and click that. You should see [localhost:3000](http://localhost:3000) with a trash can icon next to it. Just click the trash can icon to remove your wallet address connection from your app.

Go ahead and refresh your page and and you should see your "Connect To Wallet" button ready to go! Go ahead and connect! Once you do, your console should print out the word Connected and then your wallet's public address!

#### Scenario #2
Go ahead and connect your wallet! Once your wallet is connected you should see your app render something that looks like this:

BOOM. Very nice work! You just created a component in React, setup some smooth condition rendering, AND got your wallet sign in setup and ready to go! With buildspace projects, it's all about making it your own. Feel free to do whatever the heck you want with these pages!

In the next section we are going to start interacting with our contract to see if the wallet address connected has already minted a character NFT! This will unlock us to do the following:

1) Write the logic to actually mint a Character NFT
2) Setup our Arena component so we can take down any boss in our way 😈

# PART 4
###  Checking for a Character NFT.
The cool part about our game? We mint actual NFTs that are used to play and all the game logic happens on-chain. Earlier in this project, we set up all of our smart contract logic. Now it's time to actually interact with it.

### The FLow
The first thing we are going to start with is to check whether the wallet address connected to our app has a character NFT already. If it does, we can go ahead and grab the metadata from the wallet's NFT and use it to battle a boss in the metaverse ⚔️.

Here's the flow of getting our web app connected to our deployed smart contract on the Rinkeby Testnet:
1) Copy latest deployed contract address, paste it in to our web app.
2) Copy the latest ABI file, paste it into our web app's directory. (Later, we will delve more into what an ABI is).
3) Import ethers.js to help us talk to our smart contract from the client.
4) Call a function on our contract to make it do something!
Pretty straight forward, right? Let's dive in!

### Get the latest Smart Contract Address

Plain and simple, this is the deployed address of your smart contract. Recall how every time you run your deploy.js script, your console prints out the address of where your contract lives? We need that address to connect our UI to our smart contract. The blockchain has millions of contracts on it. Our client needs this address to know which contract to connect to.

We are going to be using this address in multiple components, so, let's make it ezpz to get to! At the root of your project under src go ahead and create a constants.js file and add the following code:

```
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_GOES_HERE';

export { CONTRACT_ADDRESS };
```

Then head back to your App.js file and import this at the top of your file to get access to it, like so:

```
import { CONTRACT_ADDRESS } from './constants';
```

### Get the latest ABI file.
I made a little video below explaining ABI stuff.

When you compile your smart contract, the compiler spits out a bunch of files needed that lets you interact with the contract. You can find these files in the artifacts folder located in the root of your Solidity project.

Our web app relies on the ABI file to know how to communicate with our contract. Read more about it here.
[https://docs.soliditylang.org/en/v0.5.3/abi-spec.html]

The contents of the ABI file can be found in a fancy JSON file in your hardhat project:

artifacts/contracts/MyEpicGame.sol/MyEpicGame.json

So, the question becomes - how do we get this JSON file into our frontend? The good 'ol copy / paste method!

Copy the contents from your MyEpicGame.json file and then head to your web app. You are going to make a new folder called utils under src. Under utils create a file named MyEpicGame.json. So the full path will look like: src/utils/MyEpicGame.json

Paste the ABI file contents right there in our new file.

SWEET. Now that we have our file set up, we need to import it into our App.js file to utilize it! Simply add this to the top of your imports:

```
import myEpicGame from './utils/MyEpicGame.json';
```

We now have the two things needed to call our contract from web app: the ABI file and the deployed contract address!

### Some notes on updating your Smart Contract
Deployed contracts are permanent. You can't change them. The only way to update a contract is to actually re-deploy it.

Let's say you wanted to randomly change your contract right now. Here's what we'd need to do:
1) Deploy it again.
2) Update the contract address on our frontend (copy/paste from console log).
3) Update the abi file on our frontend (copy/paste from artifacts folder).

People constantly forget to do these 3 steps when they change their contract. Don't forget lol.

Why do we need to do all this? Because smart contracts are immutable. They can't change. They're permanent. That means changing a contract requires a full redeploy. Redeploying will also reset all the variables since it'd be treated as a brand new contract. That means we lose all our NFT data when we update the contract's code.

So, what you'll need to do is:

1) Deploy again using npx hardhat run scripts/deploy.js --network rinkeby
2) Change contractAddress in constants.js to be the new contract address we got from the step above in the terminal (just like we did before the first time we deployed).
3) Get the updated abi file from artifacts and copy-paste it into your web app just like we did above.

Again -- you need to do this every time you change your contract's code or else you'll get errors :).

### Calling the Smart Contract with ethers.js

Now that we have everything we need, we can set up an object in JavaScript to interact with our smart contract. This is where ethers.js comes in handy!

Import ethers into your App.js file:
```
import { ethers } from 'ethers';
```

### Recap
We have done a lot, so let's make sure we are on the same page here -

Our goal is to call our contract to check if the current wallet address has minted a character NFT. If it has, we can move the player right to the ⚔️ Arena. ⚔️ ELSE, we need them to mint a character NFT before they can play!

Remember when we created the checkIfUserHasNFT in our smart contract?

If the player minted a NFT, that method will return the character NFT metadata. Else, it will return a blank CharacterAttributes struct. So - when do we actually want to call this?

If we think back to scenario #2:
If user has connected to your app AND does not have a character NFT, show SelectCharacter component

This means we should probably check this as soon as our app loads, right? Let's set up another useEffect to do a little fanciness here 💅:

```
/*
 * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
 */
useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
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
```
This is some of that fancy React I was talking about before. You will probably also have an error saying how transformCharacterData is undefined :(. Keep going - we will address it all shortly:

Lets go over the stuff we wrote above!

```
const fetchNFTMetadata = async () => {
  console.log('Checking for Character NFT on address:', currentAccount);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const gameContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    myEpicGame.abi,
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
```
We are declaring the function to run inside our hook. Looks sort of weird, right? But we have to do this because useEffect + async don't play well together. By declaring our async function like this, we can get around that. (This is definitely a more difficult thing to understand, so take a look on Google if you are still a little confused.)

```
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
```
This is the main logic used to setup our Ethers object and actually call our contract 🚀. A "Provider" is what we use to actually talk to Ethereum nodes. Remember how we were using Alchemy to deploy? Well, in this case, we use nodes that MetaMask provides in the background to send/receive data from our deployed contract.

We won't get too much into signers, but here is a link explaining what a signer is!
[https://docs.ethers.io/v5/api/signer/#signers]

```
const gameContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  myEpicGame.abi,
  signer
);

const txn = await gameContract.checkIfUserHasNFT();
```

After we create our provider and signer, we are ready to create our contract object! This line is what actually creates the connection to our contract. It needs: the contract's address, ABI file, and a signer. These are the three things we always need to communicate with contracts on the blockchain.

With this all set up, we can then finally call the checkIfUserHasNFT method. Again, this is going to go to our contract on the blockchain and run a read request and return some data for us. Can we pause and realize how insanely cool that is? You're a straight up blockchain developer right now 🔥.

Feel free to console.log(txn) and see what's in it!

```
if (txn.name) {
  console.log('User has character NFT');
  setCharacterNFT(transformCharacterData(txn));
} else {
  console.log('No character NFT found!');
}
```
Once we get a response from our contract, we need to check if there is indeed a minted character NFT. We are going to do this by checking if there is a name. If there is a name for the character NFT then we know this person already has one!

With that, let's set our characterNFT state with this data so we can use it in our app!

It's now time to address that transformCharacterData method we are calling. Since we will be getting character data in other spots in our app, why would we want to write the some code over and over again? Let's get a little fancy with it 😎.

We can get rid of the undefined error by heading to the constants.js file that we created to hold our contract address and add the following:

```
/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
```

This puts the data from our smart contract into a nice object that we can easily use in our UI code! Pretty nifty, eh?

Don't forget to import this back in App.js like so:

```
/*
* Just add transformCharacterData!
*/
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
```

Now, onto the final little bit of code from my snippet above:

```
if (currentAccount) {
  console.log('CurrentAccount:', currentAccount);
  fetchNFTMetadata();
}
```

Remember, we only want to call this function if we have a connected wallet address! We can't do anything if there is no wallet address, right? Any time this useEffect runs, just make sure we actually have a wallet address connected. Else, don't run anything.

```
useEffect(() => {
	...
}, [currentAccount]);
```

Alright, so what the heck is this [currentAccount] thing? It's the user's public wallet address that we get from Metamask. Anytime the value of currentAccount changes, this useffect will get fired! For example, when currentAccount changes from null to a new wallet address, this logic will run.

Do some Googling and check out this link from React docs to learn more.
[https://reactjs.org/docs/hooks-effect.html]

### Bringing it full circle

All the things are in place. You are feeling good and you're an insanely talented engineer. So let's test this, shall we?

Give your app a good 'ol refresh and make sure you don't have a connected wallet just yet. Then, go ahead and connect your wallet. Make sure you open up your console so you can see the log statements come in!

Refresh your page. At this point, you should see your console spit out: No character NFT found . Nice! This means that your code is running as it's supposed to and you are ready to start minting some character NFTs 🤘!

# Part 5
### Building the Character Select Page

We are looking great right now. We have setup two scenarios and got the basics down for actually calling our Smart Contract from our UI. Go ahead send some 👏s in #progress to show your HYPE levels. More 👏 === more hype.

Now that we are able to interact with our Smart Contract from our UI and we have created our SelectCharacter Component, we can easily grab all mint-able characters from our Smart Contract and display them in our UI. Let's jump right in.

### Setting up a reusable contract object
Since we know we are going to use our Smart Contract let's start by setting up or ethers object to interact with it. It's going to be the same flow as before, with a little twist. Let's start by importing all the things in Components/SelectCharacter/index.js :
```
import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
```

Next let's get some state properties setup. In this component we are going to need a few different state properties:

characters - This will hold all the character metadata we get back from our contract

gameContract - This one is cool! Since we are going to be using our contract in multiple spots, let's just initialize it once and store it in state to use throughout our contract:

```
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
```

As soon as our component is mounted, we are going to want to create our gameContract to start using right away! We want to display our mint-able characters as soon as possible. Which means we need to call our contract ASAP:

### Fetching all the characters
There isn't much different here other than setting our gameContract in state. We are going to use a bit more useEffect fanciness! Since we need to get our data ASAP, we want to know as soon as our gameContract is ready to use. So, why don't we just setup another useEffect to listen for any changes with gameContract ? Right under the useEffect you wrote above, add this:

```
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
```

Nice. So this is looking pretty similar to what we had in App.js right? We have this async function called getCharacters that uses our gameContract to call our getAllDefaultCharacters function which we wrote earlier in Solidity Land!

We then map through what is returned to us to transform the data in a way that our UI can easily understand.

After, we can set this data in our state to start using!

Finally, every time gameContract changes we want to make sure it's not null so we wrap our function call in a quick check.

Before we move on, let's give this a quick test! We should be able to see some cool log statements in our console. Make sure your console is open and ready to go and give your app a quick refresh. If all was successful you should see some like this:

🦄 LOOK AT THAT. You just pulled some data from your smart contract 🦄

Always a site to see thats for sure. This is cool and all, but it would be even cooler if it showed up in our app right?

### Actually rendering the characters UI 

```
// Render Methods
const renderCharacters = () =>
  characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <img src={character.imageURI} alt={character.name} />
      <button
        type="button"
        className="character-mint-button"
        onClick={mintCharacterNFTAction(index)}
      >{`Mint ${character.name}`}</button>
    </div>
  ));
```
There are a few things I want to note here before we move on —

1) If you remember from an earlier lesson, I gave you all the css needed for this component. This will make everything "just work", but I HIGHLY encourage you to tweak this!
2) You are probably going to see another undefined error for mintCharacterNFTAction . Don't worry - this will be added later! Comment this line out for now :).
3) We still need to call this render method, so why don't we do that now in the SelectCharacter component:

```
return (
  <div className="select-character-container">
    <h2>Mint Your Hero. Choose wisely.</h2>
    {/* Only show this when there are characters in state */}
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
  </div>
);
```
