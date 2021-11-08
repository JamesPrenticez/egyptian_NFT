const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('NFTGame');
  const gameContract = await gameContractFactory.deploy(
      //Name
      [
        "Ma'at", "Tutankhamun", "Set",
        
        "Sobek", "Bastet", "Hapi", 
        
        "Osiris", "Isis",  "Ra",
    ],

    //Image URLs
    [   
        "https://i.imgur.com/uHehjBx.png", "https://i.imgur.com/kDP9Ujw.png", "https://i.imgur.com/4UThf3N.png", 
        
         "https://i.imgur.com/0hdTjHq.png", "https://i.imgur.com/7Ur6SH1.png", "https://i.imgur.com/C89syN2.png",
        
        "https://i.imgur.com/cxu2m8w.png", "https://i.imgur.com/ZxDAMtb.png", "https://i.imgur.com/VIB7RXq.png",
    ],

    //Hp Values
    [
        400, 600, 1000,
        700, 700, 900,
        2000, 500, 800,
    ],

    //Attck Damage
    [
        100, 300, 100,
        500, 500, 200,
        100, 400, 1000,
    ],
    //Boss Name
    "Ammit - Devourer of Souls - Eater of Hearts",
    //Boss Image
    "https://i.imgur.com/bJiNLrt.png",
    //Boss HP
    25000,
    //Boss attack damage
    100
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