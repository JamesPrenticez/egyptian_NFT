# PART 1
### Building our boss
So, in our game our character NFT will be able to attack a boss.

The whole goal of the game is to attack the boss and bring it’s HP to 0! But, the catch is that the boss has a lot of HP and every time we hit the boss it will hit us back and bring our HP down. If our character's HP falls below 0, then our character will no longer be able to hit the boss and it'll be “dead”.

Maybe in the future, someone else would be able to build a “revive” function that allows our dead NFTs to regain 100% health points ;). But for now, if our character dies it’s game over. And we can rest easy knowing our character did its best and took one for the team. That means we need other players to attack the boss as well, we can't do this alone

Let’s first just build a basic boss struct and initialize its data, similar to how we did for our characters. The boss will basically have a name, an image, attack damage, and HP. The boss will not be a NFT. The boss’s data will just live on our smart contract.

We can add the following code right under where we declared nftHolderAttributes.
```
struct BigBoss {
  string name;
  string imageURI;
  uint hp;
  uint maxHp;
  uint attackDamage;
}

BigBoss public bigBoss;
```
Pretty simple! Just a struct to hold the boss data in an organized way and a bigBoss variable as well that will hold our boss so that we can reference it in different functions.

Then, we can actually just initialize our boss right in our contract like this:

```
constructor(
  string[] memory characterNames,
  string[] memory characterImageURIs,
  uint[] memory characterHp,
  uint[] memory characterAttackDmg,
  string memory bossName, // These new variables would be passed in via run.js or deploy.js.
  string memory bossImageURI,
  uint bossHp,
  uint bossAttackDamage
)
  ERC721("Heroes", "HERO")
{
  // Initialize the boss. Save it to our global "bigBoss" state variable.
  bigBoss = BigBoss({
    name: bossName,
    imageURI: bossImageURI,
    hp: bossHp,
    maxHp: bossHp,
    attackDamage: bossAttackDamage
  });

  console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

  // All the other character code is below here is the same as before, just not showing it to keep things short!
```

Finally, we’d just change run.js and deploy.js to pass in params for our boss:

```
const gameContract = await gameContractFactory.deploy(                        
  ["Leo", "Aang", "Pikachu"],       
  ["https://i.imgur.com/pKd5Sdk.png", 
  "https://i.imgur.com/xVu4vFL.png", 
  "https://i.imgur.com/u7T87A6.png"],
  [100, 200, 300],                    
  [100, 50, 25],
  "Elon Musk", // Boss name
  "https://i.imgur.com/AksR0tt.png", // Boss image
  10000, // Boss hp
  50 // Boss attack damage
);
```
Looks a bit ugly, but, that's it!

We now have a boss whose data lives on our contract. The boss I chose is Elon Musk. That means our players must band together to destroy Elon Musk. Why are we destroying Elon? No clue. I just thought it'd be funny to have characters like Aang the Airbender and Pikachu attacking Elon XD.

Please choose your own boss — maybe it's Darth Vader? Maybe it's your uncle? Maybe it's your cat? Whatever you choose, make sure it's your own!! Don't copy me :).

It would actually be funny if the boss was your pet dog, and, instead of trying to destroy your pet dog you're trying to get your dog to love you more. And, the more people that "pat" your dog on the head, the more your dog loves that player. You could even have a leaderboard of people who patted your dog the most lol.

Anyways, be creative. This is your project :).

### Retrieve players NFT attributes
We're going to create a function attackBoss. Here's a little outline:

```
function attackBoss() public {
  // Get the state of the player's NFT.
  // Make sure the player has more than 0 HP.
  // Make sure the boss has more than 0 HP.
  // Allow player to attack boss.
  // Allow boss to attack player.
}
```

Let's start!

The very first thing we need to do is retrieve the player's character NFT state. This would hold everything like their players HP, AD, etc. This data is held in nftHolderAttributes which requires the tokenId of the NFT. We can grab the tokenId from nftHolders! Check it out:

```
function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
}
```

First, I grab the NFT's tokenId that the player owns using nftHolders[msg.sender].

I then grab the player's attributes using nftHolderAttributes[nftTokenIdOfPlayer]. I use the keyword storage here as well which will be more important a bit later. Basically, when we do storage and then do player.hp = 0 then it would change the health value on the NFT itself to 0.

In contrast, if we were to use memory instead of storage it would create a local copy of the variable within the scope of the function. That means if we did player.hp = 0 it would only be that way within the function and wouldn't change the global value.

In run.js you can test this out by adding this anywhere under gameContract.deployed();:

```
let txn;
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();
```

Here we first mint a character w/ index 2, which is the third character in our array! So for me, my third character is Pikachu. There's something very funny about having Pikachu attack Elon Musk in-game.

This is the first character NFT we've minted so it will automatically have an id of 1. Why? Because _tokenIds starts off at 0, but then we increment it to 1 in the constructor. So, our first NFT will have an ID of 1 not 0.

Then, we do attackBoss().

When I run this here's what I get.

```
Done initializing boss Elon Musk w/ HP 10000, img https://i.imgur.com/AksR0tt.png
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 0 and characterId 2

Player w/ character Pikachu about to attack. Has 300 HP and 25 AD
Boss Elon Musk has 10000 HP and 50 AD
```

Looks good! Pikachu is about to attack our boss Elon Musk lol. Everything worked perfectly and we're now properly retrieving the NFT's state :).

### Do some checks before attacking
Next, we just need to check that the character has HP, if the character is dead then they can't attack! We'll also need to make sure that the boss has HP. Can't attack a boss if it's already been destroyed.

A few things to note here -
1) You'll also notice the special keyword require here. Feel free to read more on it here. [https://ethereum.stackexchange.com/questions/60585/what-difference-between-if-and-require-in-solidity]
2) If you are using VSCode, you may have a warning saying "Function state mutability can be restricted to view". Don't stress! This will all be fixed later on as we add more here :).

```
function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

  // Make sure the player has more than 0 HP.
  require (
    player.hp > 0,
    "Error: character must have HP to attack boss."
  );

  // Make sure the boss has more than 0 HP.
  require (
    bigBoss.hp > 0,
    "Error: boss must have HP to attack boss."
  );
}
```

### Attack the boss!
Attacking is actually not super easy.

Basically, we're working w/ uint right now. That's an "unsigned integer" meaning it can't be negative! This gets kinda weird. Let's say the boss has 10 HP left and our character has 50 AD. That means we'd need to do 10 HP - 50 AD to calculate the boss's new HP, which would be -40. But, we're working w/ uint so we can't deal w/ negative numbers!
[https://solidity-by-example.org/primitives/]

We'd get an overflow or underflow error.

We could use int which allows us to store negative numbers. But, this gets messy because most libraries like OpenZeppelin or Hardhat don't have decent support for int in their library functions. For example, we use Strings.toString which only works with uint. console.log also doesn't work w/ int easily.

So, it's worth sticking w/ uint just for the sake of ease for now.

Basically, the workaround is to simply check if we're going to get a negative number. If we are, then set the boss's HP to 0 manually instead of letting it become negative.

Let's start diving into the code we already wrote here to is makes more sense!

```
function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

  // Make sure the player has more than 0 HP.
  require (
    player.hp > 0,
    "Error: character must have HP to attack boss."
  );

  // Make sure the boss has more than 0 HP.
  require (
    bigBoss.hp > 0,
    "Error: boss must have HP to attack boss."
  );
  
  // Allow player to attack boss.
  if (bigBoss.hp < player.attackDamage) {
    bigBoss.hp = 0;
  } else {
    bigBoss.hp = bigBoss.hp - player.attackDamage;
  }
}
```

bigBoss.hp < player.attackDamage is just checking if the boss will have its HP reduced to below 0 based on the players attack damage. For example, if bigBoss.hp was 10 and player.attackDamage was 30, then we know the boss will have it's HP reduced below 0 which would cause an error! So, we just check that case, and then set the boss hp to 0 manually. Otherwise, we just do bigBoss.hp = bigBoss.hp - player.attackDamage which will reduce the boss's HP based on how much damage the player does!

### Add logic for the boss to attack the player

We also need to make sure the player's HP doesn't turn into a negative number as well because the player's HP is a uint as well! So we do:

```
function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
  
  // Make sure the player has more than 0 HP.
  require (
    player.hp > 0,
    "Error: character must have HP to attack boss."
  );

  // Make sure the boss has more than 0 HP.
  require (
    bigBoss.hp > 0,
    "Error: boss must have HP to attack boss."
  );
  
  // Allow player to attack boss.
  if (bigBoss.hp < player.attackDamage) {
    bigBoss.hp = 0;
  } else {
    bigBoss.hp = bigBoss.hp - player.attackDamage;
  }

  // Allow boss to attack player.
  if (player.hp < bigBoss.attackDamage) {
    player.hp = 0;
  } else {
    player.hp = player.hp - bigBoss.attackDamage;
  }
  
  // Console for ease.
  console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
  console.log("Boss attacked player. New player hp: %s\n", player.hp);
}
```

That's it! If player.hp < bigBoss.attackDamage then that means the boss will cause the player's hp to fall below 0 which would cause an error. So we check for that, and then manually just do player.hp = 0. Else, we set the player's new health using player.hp = player.hp - bigBoss.attackDamage;.

Before you run this, make sure run.js calls attackBoss twice :).

```
let txn;
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();
```

Is everything working? Let's see. Looks like Pikachu attacked Elon Musk with 25 AD and Elon's health dropped from 10000 to 9975 which is right! Then Elon attacks Pikachu w/ 50 AD and Pikachu's health drops from 300 to 250. Looks like everything is working nicely :).

You can see when we attack a second time, the updated HP values are used for both the character and the boss :).

Feel free to test this function by trying out a boss w/ 1 HP or trying out a player w/ 1 HP by just playing around w/ values passed to the constructor in run.js.

For example, if I give the player 1 HP here's what I get:
```
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 5

Player w/ character Seshat about to attack. Has 600 HP and 300 AD
Boss Ammit - Devourer of Souls - Eater of Hearts has 1 HP and 100 AD
Player attacked boss. New boss hp: 0
Boss attacked player. New player hp: 500


Player w/ character Seshat about to attack. Has 500 HP and 300 AD
Boss Ammit - Devourer of Souls - Eater of Hearts has 0 HP and 100 AD
Error: VM Exception while processing transaction: reverted with reason string 'Error: boss must have HP to attack boss.'
    at NFTGame1.attackBoss (contracts/NFTGame1.sol:182)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at runNextTicks (internal/process/task_queues.js:64:3)
    at listOnTimeout (internal/timers.js:526:9)
    at processTimers (internal/timers.js:500:7)
    at HardhatNode._mineBlockWithPendingTxs (C:\Users\prent\github\crypto_card_game_NFT\node_modules\hardhat\src\internal\hardhat-network\provider\node.ts:1602:23)
    at HardhatNode.mineBlock (C:\Users\prent\github\crypto_card_game_NFT\node_modules\hardhat\src\internal\hardhat-network\provider\node.ts:435:16)
    at EthModule._sendTransactionAndReturnHash (C:\Users\prent\github\crypto_card_game_NFT\node_modules\hardhat\src\internal\hardhat-network\provider\modules\eth.ts:1494:18)
```

# PART 2
### Deploy and see NFTs changing in prod.
One thing we’re doing that's super important to recognize is we’re actually changing our NFTs attributes.

For example, when we do player.hp = player.hp - bigBoss.attackDamage; it’s actually changing the Health Points attribute that shows up on OpenSea on the NFT itself. Let’s test this out to make sure it's working as expected!

### Deploy again and see the NFTs changing values.
Copy all of run.js and overwrite whats in deploy.js. Here's what my run.js looks like right now:
```
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  
  const gameContract = await gameContractFactory.deploy(                        
    ["Leo", "Aang", "Pikachu"],       
    ["https://i.imgur.com/pKd5Sdk.png", 
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/u7T87A6.png"],
    [100, 200, 300],                    
    [100, 50, 25],
    "Elon Musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
  );

  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  console.log("Done!");
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

Again, I just like keeping both separate since deploy.js I usually don't change much. What we mainly want to test now is the attackBoss function. It should change the HP on the NFT.

I deploy using npx hardhat run scripts/deploy.js --network rinkeby. From there, here's my output:
```
https://testnets.opensea.io/assets/0x4068d4e34b1c8f7cfc2d32bbf273d18889ec8732/1
```

# PART 3
### Adding in some utility functions for our web app.
Below I'm going to be going over a few functions. These won't seem really useful right now, but, they'll be insanely useful when we start working on our web app.

### Build function to check if user has a character NFT.
We need a way to check if a user has a character NFT we've given them, and then retrieve the NFT's attributes if the NFT exists. Why?

When users go to play our game and connect their wallet to our web app, we need to be able to retrieve their NFT so they can play the game and so we know stuff like their NFT's HP, AD, etc — else we need to tell them to mint one.

Here's how we're going to setup the function:
```
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
  // Get the tokenId of the user's character NFT
  // If the user has a tokenId in the map, return their character.
  // Else, return an empty character.
}
```

The plan here is to return CharacterAttributes filled with the state of the user's NFT is they have one. If they don't have an NFT for our game in their wallet, we return an empty CharacterAttributes.

```
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
  // Get the tokenId of the user's character NFT
  uint256 userNftTokenId = nftHolders[msg.sender];
  // If the user has a tokenId in the map, return their character.
  if (userNftTokenId > 0) {
    return nftHolderAttributes[userNftTokenId];
  }
  // Else, return an empty character.
  else {
    CharacterAttributes memory emptyStruct;
    return emptyStruct;
   }
}
```

Why do we do userNftTokenId > 0? Well, basically there's no way to check if a key in a map exists. We set up our map like this: mapping(address => uint256) public nftHolders. No matter what key we look for, there will be a default value of 0.

This is a problem for user's with NFT tokenId of 0. That's why earlier, I did _tokenIds.increment() in the constructor! That way, no one is allowed to have tokenId 0. This is one of those cases where we need to be smart in how we set up our code because of some of the quirks of Solidity :).

###  Retrieve all default characters. (SELECT CHARACTER SCREEN)
Our web app is going to have a "character select screen" for new players so they can choose which character NFT they want to mint!

This is pretty straight forward function to write :).

```
function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
  return defaultCharacters;
}
```
###  Retrieve the boss.
We need to be able to retrieve the boss. Why? Well — when our player is playing the game our app will need to be able to show them stuff like the boss's HP, name, image, etc!

This is also very straight forward just like our getAllDefaultCharacters function.

```
function getBigBoss() public view returns (BigBoss memory) {
  return bigBoss;
}
```

That's it!

### Adding in Events to our contract.
When we call mintCharacterNFT, how do we know it's actually done? When we do in our run script:

```
let txn = await gameContract.mintCharacterNFT(1);
await txn.wait(); 
```

This will basically return when the transaction has been mined. But, how do we know if the NFT was actually minted successfully?? It's possible that our transaction was mined, but failed for some reason (ex. b/c of an edge case bug in our code). It's also possible that our transaction was mined, but then later dropped (ex. by changes in gas fees). [https://www.reddit.com/r/ethereum/comments/m4mmy9/etherscan_dropped_my_transaction_why/]

We can return values from view functions easily because these are simple read-only calls, they are not state changing transactions.

Luckily, we have a solution and they're called Events. These are basically like webhooks. We can "fire" an event from Solidity, and then "catch" that event on our web app. Pretty freaking cool right :)? Let's do it!
[https://ethereum.stackexchange.com/questions/11228/what-is-an-event/11232#11232]

Create these two events, can add them under where we create mapping(address => uint256) public nftHolders. We need to basically tell Solidity the format of our events before we start firing them.

I also added an AttackComplete event which will be useful when we build our UI for "attacking" the boss — since we'll need to know if we successfully attacked the boss!

```
event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
event AttackComplete(uint newBossHp, uint newPlayerHp);
```
The first event, CharacterNFTMinted we're going to fire when we finish minting an NFT for our user! This will allow us to notify them when we're done minting the NFT! So, we can actually fire this event by adding this line to the very bottom of our mintCharacterNFT function (right after the _tokenIds.increment(); part) :

```
emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
```

Boom! That's it. Now our web app will be able to "catch" this event (kinda like a web hook we can listen to) when the NFT is officially done minting. We'll cover how to catch the event later.

Next we have the AttackComplete event. This would fire when we've officially attacked our boss. You can see the events return to us the boss's new hp and the player's new hp!

This is pretty cool because we can catch this event on our client and it's going to allow us to update the player + boss's HP dynamically without them needing to reload the page. It'll feel like a legit game.

All we need to do is add this line to the bottom of the attackBoss function:
```
emit AttackComplete(bigBoss.hp, player.hp);
```
### Deploying the changes
Great! Now we've added the functions that our web app will be using in our game! Give yourself a pat on the back, it's shaping up to be an awesome game! Remember that we'll need to deploy the contract again for us to use these functions.

Before we move on to our web app, we'll need to make sure we have a clean contract ready to go. We'll need to ensure our deploy.js file doesn't mint any characters to our address or make any attacks.

```
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  
  const gameContract = await gameContractFactory.deploy(                        
    ["Leo", "Aang", "Pikachu"],       
    ["https://i.imgur.com/pKd5Sdk.png", 
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/u7T87A6.png"],
    [100, 200, 300],                    
    [100, 50, 25],
    "Elon Musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
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

All that's left is to deploy it by using npx hardhat run scripts/deploy.js --network rinkeby. Remember to save your contract address for the next section.

That's it :). Let's move on to our web app!!