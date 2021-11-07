# PART 1
### Setting up your enviroment
Before anything, we'll need to get our local Ethereum network working. This is how we can compile and test our smart contract code! You know how you need to spin up a local environment to work on? Same deal here!

For now, all you need to know is that a smart contract is a piece of code that lives on the blockchain. The blockchain is a public place where anyone can securely read and write data for a fee. Think of it sorta like AWS or Heroku, except no one actually owns it! It's run by thousands of random people known as "miners".

The bigger picture here is:
1 -- We're going to write a smart contract. That contract has all the logic around our actual game.

2 -- Our smart contract will be deployed to the blockchain. This way, anyone in the world will be able to access and run our smart contract — and we'll let them access our game.

3 -- We're going to build a client website that will let people easily connect their Ethereum wallet and play our game.

I recommend also reading over these docs when you can for fun. These are the best guides on the internet for understanding how Ethereum works in my opinion!
[https://ethereum.org/en/developers/docs/intro-to-ethereum/]

### Setup local tooling.
We're going to be using a tool called Hardhat a lot which let us quickly compile smart contracts and test them locally. First you'll need to get node/npm. If you don't have it head over here.

Next, let's head to the terminal. Go ahead and cd to the directory you want to work in. Once you're there run these commands:
```
npm init -y
npm install --save-dev hardhat
```

You may see a message about vulnerabilities after you run the last command and install Hardhat. Every time you install something from NPM, there is a security check done to see if any of the packages the library you're installing has any reported vulnerabilities. This is more of a warning to you so you are aware! Google around a bit about these vulnerabilities if you want to know more!

### Get sample project working
Cool, now we should have hardhat. Let's get a sample project going.

```
npx hardhat
```

Note: If you're on Windows using Git Bash to install hardhat, you may run into an error at this step (HH1). You can try using Windows CMD to perform the HardHat install if you run into trouble. Additional info can be found here.

Choose the option to create a basic sample project. Say yes to everything.
The sample project will ask you to install hardhat-waffle and hardhat-ethers. These are other goodies we'll use later.

Go ahead and install these other dependencies just in case it didn't do it automatically.

```
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

You'll also want to install something called OpenZeppelin which is another library that's used a lot to develop secure smart contracts. We'll learn more about it later. For now, just install it :).
```
npm install @openzeppelin/contracts
```

Then run:
```
npx hardhat run scripts/sample-script.js
```

Boom! If you see some stuff in your terminal about a contract being deployed, this means that your local environment is set up and you also ran/deployed a smart contract to a local blockchain.

This is pretty epic. We'll get into this more, but basically what's happening here is:
1) Hardhat compiles your smart contract from solidity to bytecode.

2) Hardhat will spin up a "local blockchain" on your computer. It's like a mini, test version of Ethereum running on your computer to help you quickly test stuff!

3) Hardhat will then "deploy" your compiled contract to your local blockchain. That's that address you see at the end there. It's our deployed contract, on our mini version of Ethereum.

If you're curious, feel free to look at the code inside the project to see how it works. Specifically, check out Greeter.sol which is the smart contract and sample-script.js which actually runs the contract.

Once you're done exploring, let's head to the next section and start our actual game contract.

# PART 2
### Write our starter contract.
Pick your favorite code editor and open up the directory where you setup your hardhat project! Let's do a little clean-up.

We want to delete all the lame starter code generated for us. We're going to write this stuff ourselves! Go ahead and delete the file sample-test.js under test.  Also, delete sample-script.js under scripts. Then, delete Greeter.sol under contracts. Don't delete the actual folders!

Now, let's get to writing our NFT contract. If you've never written a smart contract don't worry. Just follow along. Google stuff you don't understand. Ask questions in Discord.

Create a file named MyEpicGame.sol under the contracts directory. File structure is super important when using Hardhat, so, be careful here!

I always like starting with a really basic contract, just to get things going.

```
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MyEpicGame {
  constructor() {
    console.log("THIS IS MY GAME CONTRACT. NICE.");
  }
}
```

Note: Sometimes VSCode itself will throw errors that aren't actually a problem. For example, it may underline the hardhat import and say it doesn't exist. These happens because your global Solidity compiler isn't set locally. If you don't know how to fix this, don't worry. Ignore this for now. Also I recommend that you don't use VSCode's terminal, use your own separate terminal! Sometimes the VSCode terminal gives issues if the compiler isn't set.

Let's go line-by-line here.
```
// SPDX-License-Identifier: UNLICENSED
```
Just a fancy comment.  It's called an "SPDX license identifier", feel free to Google what it is :).
```
 pragma solidity ^0.8.0;
```
This is the version of the Solidity compiler we want our contract to use. It basically says "when running this, I only want to use version 0.8.0 of the Solidity compiler, nothing lower. Note, be sure your compiler is set to 0.8.0 in hardhat.config.js

```
import "hardhat/console.sol";
```
Some magic given to us by Hardhat to do some console logs in our contract. It's actually challenging to debug smart contracts but this is one of the goodies Hardhat gives us to make life easier.

```
contract MyEpicGame {
    constructor() {
        console.log("THIS IS MY GAME CONTRACT. NICE.");
    }
}
```
So, smart contracts kinda look like a class in other languages, if you've ever seen those! Once we initialize this contract for the first time, that constructor will run and print out that line. Please make that line say whatever you want. Have a little fun with it.

### How do we run it?
Awesome — we've got a smart contract! But, we don't know if it works. We need to actually:

1) Compile it.
2) Deploy it to our local blockchain.
3) Once it's there, that console.log will run.

We're just going to write a custom script that handles those 3 steps for us.

Go into the scripts directory and make a file named run.js. This is what run.js is going to have inside it:
```
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy();
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

### How does the run script work?
Again going line by line here.

```
const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
```
This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory. Go check it out after you run this :).

```
const gameContract = await gameContractFactory.deploy();
```
This is pretty fancy :).

What's happening here is Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network. So, every time you run the contract, it'll be a fresh blockchain. Whats the point? It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.

```
await gameContract.deployed();
```
We'll wait until our contract is officially mined and deployed to our local blockchain! That's right, hardhat actually creates fake "miners" on your machine to try its best to imitate the actual blockchain.

Our constructor runs when we actually are fully deployed!

```
console.log("Contract deployed to:", gameContract.address);
```
Finally, once it's deployed gameContract.address will basically give us the address of the deployed contract. This address is how can actually find our contract on the blockchain. Right now on our local blockchain it's just us. So, this isn't that cool.

But, there are millions of contracts on the actual blockchain. So, this address gives us easy access to the contract we're interested in working with! This will come in handy when we deploy to the actual blockchain in a few lessons

### Run it
*Before you run this, be sure to change solidity: "0.8.4", to solidity: "0.8.0", in your hardhat.config.js.*

```
npx hardhat run scripts/run.js
```
You should see your console.log run from within the contract and then you should also see the contract address print out!!!

###  Hardhat & HRE
In these code blocks you will constantly notice that we use hre.ethers, but hre is never imported anywhere? What type of sorcery is this?

Directly from the Hardhat docs themselves, you will notice this:

The Hardhat Runtime Environment, or HRE for short, is an object containing all the functionality that Hardhat exposes when running a task, test or script. In reality, Hardhat is the HRE.

So what does this mean? Every time you run a terminal command that starts with npx hardhat you are getting this hre object built on the fly using the hardhat.config.js specified in your code! This means you will never have to actually do some sort of import into your files like:

const hardhat = require("hardhat")

TL;DR - you will be seeing hre a lot in our code, but never imported anywhere! Check out the Hardhat documentation to learn more about it!
[https://hardhat.org/advanced/hardhat-runtime-environment.html]

# PART 3
### What's an NFT
Haha, this is a big question. Be sure to read through this real quick to give you a little primer before moving on. As long as you have a general idea about what an NFT is, that's all you really need here!
[https://github.com/buildspace/buildspace-projects/blob/main/NFT_Collection/en/Section_1/Lesson_1_What_Is_A_NFT.md]

###  How we're going to use playable NFTs.
Cool. We've got all our basic environment stuff set up! Let's take a step back to kinda explain this game we're making at a higher level again:

The goal of our game will be to destroy a boss. Let's say that boss has 1,000,000 HP. What players do is when they start the game, they mint a character NFT that has a certain amount of Attack Damage and HP. Players can order their character NFT to attack the boss and deal damage to it. Kinda like a Pokemon!

The goal? Players need to work together to attack the boss and bring its HP down to 0. The catch? Every time a player hit the boss, the boss hits the player back! If the NFT's HP goes below 0, the player's NFT dies and they can't hit the boss anymore. Players can only have one character NFT in their wallet. Once the character's NFT dies, it's game over. That means many players need to join forces to attack the boss and kill it.

Note: If you want your player to be able to hold multiple character in their wallet (like Pokemon) feel free to make the modifications on your own!

The important thing to know here is that the characters themselves are NFTs.

So, when a player goes to play the game:
1) They'll connect their wallet.
2) Our game will detect they don't have a character NFT in their wallet.
3) We'll let them choose a character and mint their own character NFT to play the game. Each character NFT has its own attributes stored on the NFT directly like: HP, Attack Damage, the image of the character, etc. So, when the character's HP hits 0, it would say hp: 0 on the NFT itself.

This is exactly how the world's most popular NFT games work :). We're going to build it ourselves! What we need to do first is basically set up our minting NFT code because, without that, players can't even get into our game to play!

### Setup the data for your NFTs
Time for the fun part, setting up our character NFTs. Each character will have a few attributes: an image, a name, HP value, and attack damage value. These attributes will live directly on the NFT itself. We may add some more attributes later on.

The way our character NFTs will work is there will only be a set # of characters (ex. 3). But, an unlimited # of NFTs of each character can be minted. Again, you can change this if you want — for example if you want only a small # of a certain character to be minted.

So that means if five people mint character #1, that means all five people will have the exact same character but each person will have a unique NFT and each NFT holds its own state. For example, if Player #245's NFT gets hit and loses HP, only their NFT should lose HP!

If that doesn't make sense, don't worry! Let's just jump in the code — it'll slowly make more sense.

The first thing we need to do is actually have a way to initialize a character's default attributes (ex. their default HP, default attack damage, default image, etc). For example, if we have a character named "Pikachu", then we need to set Pikachu's base HP, base attack damage, etc.

I updated MyEpicGame.sol to look like this:
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MyEpicGame {
  // We'll hold our character's attributes in a struct. Feel free to add
  // whatever you'd like as an attribute! (ex. defense, crit chance, etc).
  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;        
    uint hp;
    uint maxHp;
    uint attackDamage;
  }
  // A lil array to help us hold the default data for our characters.
  // This will be helpful when we mint new characters and need to know
  // things like their HP, AD, etc.
  CharacterAttributes[] defaultCharacters;

  // Data passed in to the contract when it's first created initializing the characters.
  // We're going to actually pass these values in from from run.js.
  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
  )
  {
    // Loop through all the characters, and save their values in our contract so
    // we can use them later when we mint our NFTs.
    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDmg[i]
      }));

      CharacterAttributes memory c = defaultCharacters[i];
      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
    }
  }
}
```
There is a lot happening here but essentially I'm passing in a bunch of values to my constructor to set up my characters. Why? Well — I need a way to tell my contract, "Hey — when a player requests a Pikachu NFT, please give that NFT this base HP, this base AD, this base image, etc".

*Remember, the constructor runs only once when the contract is executed.*

I take the character data in my constructor and store it nicely on the contract in a struct of type CharacterAttributes. Each CharacterAttributes holds the base attributes for each character.

```
struct CharacterAttributes {
  uint characterIndex;
  string name;
  string imageURI;        
  uint hp;
  uint maxHp;
  uint attackDamage;
}
```

I actually store each character in an array called defaultCharacters.
```
CharacterAttributes[] defaultCharacters;
```

All this gives me is easy access to each character. For example, I can just do defaultCharacters[0] and get access to the default attributes of the first character. This is useful for when we mint our NFTs and need to initialize their data!

We then need to update run.js. Here's what that looks like:

```
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ["Leo", "Aang", "Pikachu"],       // Names
    ["https://i.imgur.com/pKd5Sdk.png", // Images
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/WMB6g9u.png"],
    [100, 200, 300],                    // HP values
    [100, 50, 25]                       // Attack damage values
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

I'm not doing anything very fancy here. In run.js I basically define my three characters and their stats. My characters are Leonardo DiCaprio, Aang from Avatar, and Pikachu...lol. Each character basically has an: id, name, image, hp value, and attack value.

For example, in this case Aang has 200 HP, and 50 Attack Damage. He has a lot of health, but his attacks don't hit as hard as Leonardo! Leonardo has less HP, but his attacks are more powerful. That means in the game he'll die faster, but will do lots of damage.

Okay, that's it :)!! When I run this using 
``` 
npx hardhat run scripts/run.js
```

Boom! We've officially created three characters and are saving their data directly on our contract.

Maybe your characters can be from your fav anime or video game.
Maybe you don't even want characters. Maybe instead you want people to mint "weapons" that players using in the game like a sword, machine gun, or a laser cannon.

Maybe you want your characters to have things like "mana", "energy", or "chakra" where your character can cast certain "spells" using these attributes.

Changing around little things like the character will make you feel more like it's your own thing and you'll be a little more motivated to build this thing all the way :).

# PART 4 
### Mint the NFT's
Now that we have all the data nicely set up for our characters, the next thing to do is actually mint the NFT. Let's go through that process. Here's my updated contract and I put a comment above lines I changed/added to make it easy!

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


import "hardhat/console.sol";

// Our contract inherits from ERC721, which is the standard NFT contract!
contract MyEpicGame is ERC721 {

  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;        
    uint hp;
    uint maxHp;
    uint attackDamage;
  }

  // The tokenId is the NFTs unique identifier, it's just a number that goes
  // 0, 1, 2, 3, etc.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  CharacterAttributes[] defaultCharacters;

  // We create a mapping from the nft's tokenId => that NFTs attributes.
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

  // A mapping from an address => the NFTs tokenId. Gives me an ez way
  // to store the owner of the NFT and reference it later.
  mapping(address => uint256) public nftHolders;

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
    // Below, you can also see I added some special identifier symbols for our NFT.
    // This is the name and symbol for our token, ex Ethereum and ETH. I just call mine
    // Heroes and HERO. Remember, an NFT is just a token!
  )
    ERC721("Heroes", "HERO")
  {
    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDmg[i]
      }));

      CharacterAttributes memory c = defaultCharacters[i];
      
      // Hardhat's use of console.log() allows up to 4 parameters in any order of following types: uint, string, bool, address
      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
    }

    // I increment tokenIds here so that my first NFT has an ID of 1.
    // More on this in the lesson!
    _tokenIds.increment();
  }

  // Users would be able to hit this function and get their NFT based on the
  // characterId they send in!
  function mintCharacterNFT(uint _characterIndex) external {
    // Get current tokenId (starts at 1 since we incremented in the constructor).
    uint256 newItemId = _tokenIds.current();

    // The magical function! Assigns the tokenId to the caller's wallet address.
    _safeMint(msg.sender, newItemId);

    // We map the tokenId => their character attributes. More on this in
    // the lesson below.
    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].hp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
    
    // Keep an easy way to see who owns what NFT.
    nftHolders[msg.sender] = newItemId;

    // Increment the tokenId for the next person that uses it.
    _tokenIds.increment();
  }
}
```
A lot of stuff going on here.

First thing I do is create two state variables which are sorta like permanent global variables on the contract. Read about them here.
[https://ethereum.stackexchange.com/questions/25554/local-variable-and-state-variable-and-the-difference-between-them/25556#25556]

```
mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
mapping(address => uint256) public nftHolders;
```
nftHolderAttributes will be where we store the state of the player's NFTs. We map the the NFT's id to a CharacterAttributes struct.

Remember, every player has their own character NFT. And, every single NFT has their own state like HP, Attack Damage, etc! So if Player #172 owns a "Pikachu" NFT and their Pikachu NFT loses health in a battle then only Player 172's Pikachu NFT should be changed everyone else's Pikachu should stay the same! So, we store this player character level data in a map.

Next, I have nftHolders which basically lets me easily map the address of a user to the ID of the NFT they own. For example, I would be able to do nftHolders[INSERT_PUBLIC_ADDRESS_HERE] and instantly know what NFT that address owns. It's just helpful to keep this data on the contract so it's easily accessible.

### ERC 721
You'll also see I "inherit" an OpenZeppelin contract using is ERC721  when I declare the contract. You can read more about inheritance here, but basically, it means we can call other contracts from ours. It's almost like importing functions for us to use.
[https://solidity-by-example.org/inheritance/]

The NFT standard is known as ERC721 which you can read a bit about here. OpenZeppelin essentially implements the NFT standard for us and then lets us write our own logic on top of it to customize it. That means we don't need to write boilerplate code.

It'd be crazy to write a HTTP server from scratch without using a library, right? Of course, unless you wanted to explore lol. Similarly — it'd be crazy to just write an NFT contract from complete scratch! You can explore the ERC721 contract we're inheriting from here.
[https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol]

```
_tokenIds.increment();
```
So, _tokenIds starts at 0. It's just a counter. increment() just adds 1 - see here.
[https://github.com/OpenZeppelin/openzeppelin-contracts/blob/fa64a1ced0b70ab89073d5d0b6e01b0778f7e7d6/contracts/utils/Counters.sol#L32]

In the constructor I increment it to 1. Why? Basically because I don't like dealing w/ 0s in my code. In Solidity, 0 is a default value and I try to stay away from default values. Just trust me on it for now ;).
[https://docs.soliditylang.org/en/v0.5.11/control-structures.html#scoping-and-declarations]

```
function mintCharacterNFT(uint _characterIndex)
```
This function is where the actual minting is happening.

First, you'll see that we pass in _characterIndex. Why?

Well, because players need to be able to tell us which character they want! For example, if I do mintCharacterNFT(0) then the character w/ the stats of defaultCharacters[0] is minted!

```
uint256 newItemId = _tokenIds.current();
```

From there we have a number called newItemId. This is the id of the NFT itself. Remember, each NFT is "unique" and the way we do this is we give each token a unique ID. It's just a basic counter. _tokenIds.current() starts at 0, but, we did _tokenIds.increment() in the constructor so it'll be at 1.

We're using _tokenIds to keep track of the NFTs unique identifier, and it's just a number! So, when we first call mintCharacterNFT, newItemId is 1. When we run it again, newItemId will be 2, and so on!

_tokenIds is state variable which means if we change it, the value is stored on the contract directly like a global variable that stays permanently in memory.

```
_safeMint(msg.sender, newItemId). 
```
This is the magic line! When we do _safeMint(msg.sender, newItemId) it's pretty much saying: "mint the NFT with id newItemId to the user with address msg.sender". Here, msg.sender is a variable Solidity itself provides that easily gives us access to the public address of the person calling the contract.

You can't call a contract anonymously, you need to have your wallet credentials connected. This is almost like "signing in" and being authenticated :).

What's awesome here is this is a super-secure way to get the user's public address. Keeping the public address itself a secret isn't an issue, it's already public!! Everyone sees it. But, by using msg.sender you can't "fake" someone else's public address unless you had their wallet credentials and called the contract on their behalf!

### Holding dynamix data on a NFT

So, as players play the game, certain values on their character will change, right? For example, If I have my character attack the boss, the boss will hit back! In that case, my NFT's HP would need to go down. We need a way to store this data per player:

```
nftHolderAttributes[newItemId] = CharacterAttributes({
  characterIndex: _characterIndex,
  name: defaultCharacters[_characterIndex].name,
  imageURI: defaultCharacters[_characterIndex].imageURI,
  hp: defaultCharacters[_characterIndex].hp,
  maxHp:defaultCharacters[_characterIndex].hp,
  attackDamage: defaultCharacters[_characterIndex].attackDamage
});
```
A lot happening here! Basically, our NFT holds data related to our player's NFT. But, this data is dynamic. For example, let's say I create a NFT. By default my NFT starts with default stats like:

```
{
  characterIndex: 1,
  name: "Aang",
  imageURI: "https://i.imgur.com/xVu4vFL.png",
  hp: 200,
  maxHp: 200,
  attackDamage: 50
} 
```
Remember, every player has their own character NFT and the NFT itself holds data on the state of the character.

Let's say my character is attacked and loses 50 HP, well then HP would go from 200 → 150, right? That value would need to change on the NFT!
```
{
  characterIndex: 1,
  name: "Aang",
  imageURI: "https://i.imgur.com/xVu4vFL.png",
  hp: 150,
  maxHp: 200,
  attackDamage: 50
} 
```
Or maybe we want our game to have upgradeable characters, where you can give your character a sword and add +10 attack damage from 50 → 60. Then, attackDamage would need to change on the NFT!

People often think that NFTs metadata isn't allowed to change, but, that's not true. It's actually up to the creator!!!

In this case, our character name and character image never change, but it's HP value definitely does! Our NFTs must be able to maintain the state of our specific player's character.

This is why we need the variable nftHolderAttributes which maps the tokenId of the NFT to a struct of CharacterAttributes. It allows us to easily update values related to the player's NFT. That means as players play our game and their NFT's hp value changes (because the boss hits them), we actually change their hp value on nftHolderAttributes. And that's how we can store player-specific NFT data on our contract!

Next, we do:
```
nftHolders[msg.sender] = newItemId;
```
Map the user's public wallet address to the NFTs tokenId. What this lets me do later is easily keep track of who owns which NFTs.

Note: Right now this is designed where each player can only hold one character NFT per wallet address. If you wanted, you could adjust this to where players can hold multiple characters but I stuck with 1 character per player for the sake of ease! This is our game, do whatever the heck you want.

```
_tokenIds.increment();
```
After the NFT is minted, we increment tokenIds using _tokenIds.increment() (which is a function OpenZeppelin gives us). This makes sure that next time an NFT is minted, it'll have a different tokenIds identifier. No one can have a tokenIds that's already been minted.

### Running it locally
In run.js what we need to do is actually call mintCharacterNFT. I added the following lines to run.js right under where we print out the contract address.

```
let txn;
// We only have three characters.
// an NFT w/ the character at index 2 of our array.
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

// Get the value of the NFT's URI.
let returnedTokenUri = await gameContract.tokenURI(1);
console.log("Token URI:", returnedTokenUri);
```

When we do mintCharacterNFT(2) Hardhat will actually call this function with a default wallet that it sets up for us locally. So that means msg.sender will be the public address of our local wallet! This is another reason Hardhat is so nice, it easily lets us use default local wallets!! This is usually a massive pain to set up yourself.

The function tokenURI is something we get for free from ERC721 since we inherited from it.

Basically, tokenUri is a function on every NFT that returns the actual data attached to the NFT. So when I call gameContract.tokenURI(1) it's basically saying, "go get me the data inside the NFT with tokenId 1", which would be the first NFT minted. And, it should give me back everything like: my character's name, my character's current hp, etc.

Platforms like OpenSea and Rarible know to hit tokenURI since that's the standard way to retrieve the NFTs metadata. Let's try running our contract again remember the command is: 

```
npx hardhat run scripts/run.js
```

```
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2
Token URI:
```

Hmmmmmm. Token URI prints out nothing! That means we have no data attached to our NFT. But wait, that makes no sense! Didn't we already set our data up with nftHolderAttributes?

Nope. nftHolderAttributes hasn't actually attached to our NFT in any way. It's just a mapping that lives on the contract right now. What we're going to do next is basically attach nftHolderAttributes to the tokenURI by overriding it :).

# Setup tokenURI
The tokenURI actually has a specific format! It's actually expecting the NFT data in *JSON*.

Let's go over how to do this :).

Create a new folder under contracts called libraries. Create a file named Base64.sol and drop it under libraries. Copy and paste the code from here into Base64.sol. This basically provides us with some helper functions to let us encode any data into a Base64 string — which is a standard way to encode some piece of data into a string. Don't worry, you'll see how it works in a bit!
[https://gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832]

We'll need to import that library into our contract. For that, add the following snippet near the top of your file, with the other imports.

```
// Helper we wrote to encode in Base64
import "./libraries/Base64.sol";
```

```
function tokenURI(uint256 _tokenId) public view override returns (string memory) {
  CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

  string memory strHp = Strings.toString(charAttributes.hp);
  string memory strMaxHp = Strings.toString(charAttributes.maxHp);
  string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

  string memory json = Base64.encode(
    bytes(
      string(
        abi.encodePacked(
          '{"name": "',
          charAttributes.name,
          ' -- NFT #: ',
          Strings.toString(_tokenId),
          '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
          charAttributes.imageURI,
          '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
          strAttackDamage,'} ]}'
        )
      )
    )
  );

  string memory output = string(
    abi.encodePacked("data:application/json;base64,", json)
  );
  
  return output;
}
```
This looks pretty complex. But, it's not too crazy! First we start here:
```
CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
```

This line actually retrieves this specific NFTs data by querying for it using it's _tokenId that was passed in to the function. So, if I did tokenURI(256) it would return the JSON data related the 256th NFT (if it existed!).

Then, we take all that data and pack it nicely in a variable named json. The JSON's structure looks sorta like this (when it's all cleaned up):

```
{
  "name": "Aang",
  "description": "This is a description", 
  "image": "https://i.imgur.com/xVu4vFL.png", 
  "attributes": [
		{ "trait_type": "Health Points", "value": 200, "max_value": 200 },
		{ "trait_type": "Attack Damage", "value": 50 }
	], 
}
```
You can read more on the structure of the data here.
[https://docs.opensea.io/docs/metadata-standards#metadata-structure]

So, this may look pretty crazy but it's just us structuring the data to follow the format above:
```
string memory json = Base64.encode(
  bytes(
    string(
      abi.encodePacked(
        '{"name": "',
        charAttributes.name,
        ' -- NFT #: ',
        Strings.toString(_tokenId),
        '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
        charAttributes.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
        strAttackDamage,'} ]}'
      )
    )
  )
);
```

We dynamically set things like the NFTs name, HP, AD, etc. Note: abi.encodePacked just combines strings. This is really cool because we can change things like the NFTs HP or image later if we wanted and it'd update on the NFT itself! It's dynamic.

Also, this metadata standard is followed by tons of popular NFT websites like OpenSea. So, all we're doing in the function is we're nicely formatting our json variable to follow the standards! Note: max_value isn't required, but, I decided to just add it in for fun.

```
abi.encodePacked("data:application/json;base64,", json)
```

This line is actually kinda hard to explain, it's easier to just show you! Go ahead and run run.js. Here's my output

```
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2
Token URI: data:application/json;base64,data:application/json;base64,eyJuYW1lIjogIlBpa2FjaHUgLS0gTkZUICM6IDEiLCAiZGVzY3JpcHRpb24iOiAiQ3JpdGljYWxIaXQgaXMgYSB0dXJuLWJhc2VkIE5GVCBnYW1lIHdoZXJlIHlvdSB0YWtlIHR1cm5zIHRvIGF0dGFjayB0aGUgYm9vcy4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9pLmltZ3VyLmNvbS91N1Q4N0E2LnBuZyIsICJhdHRyaWJ1dGVzIjogWyB7ICJ0cmFpdF90eXBlIjogIkhlYWx0aCBQb2ludHMiLCAidmFsdWUiOiAzMDAsICJtYXhfdmFsdWUiOjMwMH0sIHsgInRyYWl0X3R5cGUiOiAiQXR0YWNrIERhbWFnZSIsICJ2YWx1ZSI6IDI1fSBdfQ==
```
You'll see that Token URI now actually prints stuff out! Nice! Go ahead and copy that whole string after Token URI:. For example, mines looks like this:

```
data:application/json;base64,eyJuYW1lIjogIlBpa2FjaHUgLS0gTkZUICM6IDEiLCAiZGVzY3JpcHRpb24iOiAiQ3JpdGljYWxIaXQgaXMgYSB0dXJuLWJhc2VkIE5GVCBnYW1lIHdoZXJlIHlvdSB0YWtlIHR1cm5zIHRvIGF0dGFjayB0aGUgYm9vcy4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9pLmltZ3VyLmNvbS91N1Q4N0E2LnBuZyIsICJhdHRyaWJ1dGVzIjogWyB7ICJ0cmFpdF90eXBlIjogIkhlYWx0aCBQb2ludHMiLCAidmFsdWUiOiAzMDAsICJtYXhfdmFsdWUiOjMwMH0sIHsgInRyYWl0X3R5cGUiOiAiQXR0YWNrIERhbWFnZSIsICJ2YWx1ZSI6IDI1fSBdfQ==
```

Paste that string into the URL bar of your browser. What you'll see is something that looks like this:

BOOOOOOM!!!

Basically, what we did was we formatted our JSON file and then encoded it in Base64. So it turns the JSON file into this super long, encoded string that is readable by our browser when we prepend it with data:application/json;base64,

We add data:application/json;base64, because our browser needs to know how to read the encoded string we're passing it. In this case we're saying,

"Hey, I'm passing you a Base64 encoded JSON file, please render it properly".

Again, this is considered a standard for a majority of browsers which is perfect because we want our NFTs data to be compatible with as many existing systems as possible.

Why are we doing all this Base64 stuff? Well, basically this is how popular NFT websites like OpenSea, Rarible, and many others prefer when we pass them JSON data from our contract directly :).

Awesome. So, we're at the point we are officially minting NFTs locally and the NFT has actual data attached to it in a way that properly follows standards

We're ready to deploy our NFT to OpenSea :).

# PART 5
### Getting our NFT online
When we use run.js, it's just us working locally.

The next step is a testnet which you can think of as like a "staging" environment. When we deploy to a testnet we'll actually be able to to view our NFT online and we are a step closer to getting this to real users.

### Metamask

Next we need an Ethereum wallet. There are a bunch of these, but, for this project we're going to use Metamask. Download the browser extension and set up your wallet here. Even if you already have another wallet provider, just use Metamask for now.

Why do we need Metamask? Well. We need to be able to call functions on our smart contract that live on the blockchain. And, to do that we need to have a wallet that has our Ethereum address and private key.

But, we need something to connect our website with our wallet so we can securely pass our wallet credentials to our website so our website can use those credentials to call our smart contract. You need to have valid credentials to access functions on smart contracts.

It's almost like authentication. We need something to "login" to the blockchain and then use those login credentials to make API requests from our website.

So, go ahead and set it all up! Their setup flow is pretty self-explanatory :).

### Transactions

When we want to perform an action that changes the blockchain we call it a transaction. For example, sending someone ETH is a transaction because we're changing account balances. Doing something that updates a variable in our contract is also considered a transaction because we're changing data. Minting an NFT is a transaction because we're saving data on the contract.

Deploying a smart contract is also a transaction.

Remember, the blockchain has no owner. It's just a bunch of computers around the world run by miners that have a copy of the blockchain.

When we deploy our contract, we need to tell all those miners, "hey, this is a new smart contract, please add my smart contract to the blockchain and then tell everyone else about it as well".

This is where Alchemy comes in.

Alchemy essentially helps us broadcast our contract creation transaction so that it can be picked up by miners as quickly as possible. Once the transaction is mined, it is then broadcasted to the blockchain as a legit transaction. From there, everyone updates their copy of the blockchain.

This is complicated. And, don't worry if you don't fully understand it. As you write more code and actually build this app, it'll naturally make more sense.

So, make an account with Alchemy here.
[https://alchemy.com/?r=b93d1f12b8828a57]

Set up you env file and copy in your Alchemy key

### Testnets
We're not going to be deploying to the "Ethereum mainnet" for now. Why? Because it costs real $ and it's not worth messing up! We're just hacking around right now. We're going to start with a "testnet" which is a clone of "mainnet" but it uses fake $ so we can test stuff out as much as we want. But, it's important to know that testnets are run by actual miners and mimic real-world scenarios.

This is awesome because we can test our application in a real-world scenario where we're actually going to:

1) Broadcast our transaction
2) Wait for it to be picked up by actual miners
3) Wait for it to be mined
4) Wait for it be broadcasted back to the blockchain telling all the other miners to update their copies

### Getting some fake $
There are a few testnets out there and the one we'll be using is called "Rinkeby" which is run by the Ethereum foundation.

In order to deploy to Rinkeby, we need fake ETH. Why? Because if you were deploying to the actual Ethereum mainnet, you'd use real money! So, testnets copies how mainnet works, only difference is no real money is involved.

In order get fake ETH, we have to ask the network for some. This fake ETH will only work on this specific testnet. You can grab some fake Ethereum for Rinkeby through a "faucet". You just gotta find one that works!

Please make sure you're on the Rinkeby network on Metamask. This is a super common issue I see!

[Rinkeby | https://faucet.rinkeby.io/]

### Setup a deploy.js file

It's good practice to separate your deploy script from your run.js script. run.js is where we mess around a lot, we want to keep it separate. Go ahead and create a file named deploy.js under the scripts folder. Copy-paste all of run.js into deploy.js. It's going to be exactly the same right now.

I added a few extra calls to mintCharacterNFT as well just to test stuff out!

```
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(                     
    ["Leo", "Aang", "Pikachu"],       
    ["https://i.imgur.com/pKd5Sdk.png", 
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/u7T87A6.png"],
    [100, 200, 300],                    
    [100, 50, 25]                       
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  
  let txn;
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.log("Minted NFT #1");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #2");

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log("Minted NFT #3");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #4");

  console.log("Done deploying and minting!");

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

### Deploy to Rinkeby testnet
We'll need to change our hardhat.config.js file. You can find this in the root directory of your smart contract project.

```
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'YOUR ALCHEMY_API_URL',
      accounts: ['YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY'],
    },
  },
};
```

You can grab your API URL from the Alchemy dashboard and paste that in. Then, you'll need your private rinkeby key (not your public address!) which you can grab from metamask and paste that in there as well.

Note: DON'T COMMIT THIS FILE TO GITHUB. IT HAS YOUR PRIVATE KEY. YOU WILL GET HACKED + ROBBED. THIS PRIVATE KEY IS THE SAME AS YOUR MAINNET PRIVATE KEY. We'll talk about .env variables later and how to keep this stuff secret

Why do you need to use your private key? Because in order to perform a transaction like deploying a contract, you need to "login" to the blockchain and sign/deploy the contract. Also, your username is your public address and your password is your private key. It's kinda like logging into AWS or GCP to deploy.

Once you've got your config setup you're all set to deploy with the deploy script we wrote earlier.

Run this command from the root directory of epic-game.
```
npx hardhat run scripts/deploy.js --network rinkeby
```

It takes like 1-2 min to deploy usually. We're not only deploying! We're also minting NFTs in deploy.js so that'll take some time as well. We actually need to wait for the transaction to be mined + picked up by miners. Pretty epic :). That one command does all that!

Here's what I get:
```
Contract deployed to: 0x1bB5b2f90AaB36E2742886f75DD7F3c5B420Bf33
Minted NFT #1
Minted NFT #2
Minted NFT #3
Minted NFT #4
Done deploying and minting!
```

We can make sure it all worked properly using Rinkeby Etherscan where you can paste the contract address that was output and see what's up with it! Here I can see that we've had five transactions. One contract creation transaction and four transactions where we minted the NFT. Which is correct :)!
[https://rinkeby.etherscan.io/]

Get used to using Rinkeby Etherscan a lot to debug deploys because it's the easiest way to track deployments and if something goes wrong. If it's not showing up on Etherscan, then that means it's either still processing or something went wrong! Here's what I get:

If it worked — AWEEEEESOME YOU JUST DEPLOYED A CONTRACT AND MINTED NFTS.

*Contract deployed to: 0x8df0B1BDf6f2e6696713E60611DA58F106bAfF4F*

### View on OpenSea
Believe it or not. The NFTs you just minted will be on OpenSea's Testnet site.

Head to [testnets.opensea.io]. Here, search for your contract address which is the address that you can find in your terminal. Don't click enter on the search bar. OpenSea is weird so you'll need click the collection itself when it comes up.

BOOM THERE ARE MY CHARACTERS!! If you click one of your characters, you'll be able to click "Levels" on the left and even see specific attributes! We even have a little health bar!!! EPICCCC. Each health bar is different depending on the NFT, for example Pikachu has 300 HP and Leo has 100 HP!

[https://testnets.opensea.io/collection/heroes-ku9jgsdqrp]

In this case, OpenSea rendered all our character's attributes properly!

What's cool here is if we change the HP value of this player's NFT to 150 or whatever, it would actually update on OpenSea! This is super cool because the NFT itself dynamically holds the state of the player's character :). We don't need any centralized server holding that data.

This is awesome because now when our players go to play the game and we detect their NFT, we'll know exactly what the state of their character NFT is in the game!

Note: You'll notice that we minted 4 NFTs to the same wallet in this case — this wouldn't be allowed in our game b/c each player would only be allowed to have 1 NFT. I just wanted to test it out. Also, right now nftHolders can only hold one tokenId per unique address. So, everytime a new NFT is minted to the same address, the previous tokenId is overwritten. You could throw an error if you wanted to instead.

### Why is this a big deal?
It’s worth talking about why what you just did is a big deal.

Basically, you made an NFT. So, that’s already cool. People can own a character from your game in their wallet, yay!

But, these NFTs actually have attributes as well! Like attack damage, health, mana, or whatever else you added. So, that means the NFT itself is more than just a JPG — it has other elements that make it more interactive.

The biggest NFT game in the world, Axie Infinity, functions just like this as well. It's a turn-based, Pokemon style game where you fight against other players 1v1.

What we’re going to do next is we’re going to actually program in logic to our NFT to “fight” a “boss” in our game. So, that means players will be able to take their NFT to the arena and collaborate with other players to “attack” a big boss you’ll create! When a NFT attacks this boss, the boss can attack the NFT back and the player's NFT will lose health. The HP value on OpenSea would change :).

Sorta like Pokemon!

That means our NFT will have utility outside of just being cool to look at.

This is pretty awesome. In normal games today, you’d buy a game and then pick your character (ex. like in Super Smash Brothers)

In this case, players pick their character NFT, then can play their NFT in-game, and own that character in their wallet forever or until they want to sell it to another player. The selling aspect is extremely interesting, because it means as the player you get something back for playing the game or helping it increase in popularity.

Another interesting is that players would be able to take their character NFT to other games that support it.

This is a pretty wild thing to think about. It’s one of the biggest reasons crypto + gaming is so cool.

Remember that Mario NFT example earlier, where others could build on top of Mario? Same deal here with our character NFTs!

For example, let’s say I have 100,000 people mint my “Pikachu” NFT for my game. Now, there are 100,000 unique players who own this NFT.

Another developer could come in and build another game on top of the Pikachu NFT and allow any player who has the NFT to enter their game and play it! They could make it where anyone w/ the Pikachu NFT would be able to play as Pikachu in their game. It’s totally up to them.

Note: In this case, the Pokemon creators might get mad lol. But, imagine Pikachu was your own original character!

Maybe stuff like HP and attack damage is even shared between games, meaning different games could build on top of the original attributes we created.

For example, let’s say we have other devs start building “items” on top of our NFT characters — like swords, shields, potions, etc. Maybe a dev builds something where a NFT character could “equip” a shield in and gain +50 defense. This can all be done in an open, permission-less way :).

On top of that, as the creator of the original Pikachu NFTs — I can charge a royalty fee every time someone buys/sells the original NFTs and that means as my NFTs gain popularity I would make money on every sale.

Okay — lets get to actually programming our game logic now :).