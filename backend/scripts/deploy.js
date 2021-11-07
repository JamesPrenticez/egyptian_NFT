const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('NFTGame');
  const gameContract = await gameContractFactory.deploy(
      //Name
      [
        "Atum", "Ramses", "Meskhenet", //3
    
        "Ma'at", "Nafertari", "Seshat", //6
        
        "Set", "Tutankhamun", "Isis", //9
        
        "Sobek", "Bastet", "Hapi", //12
        
        "Ptah", "Sokar", "Osiris", //15
    
        "Anubis", "Ra", "Horis" //18
    ],

    //Image URLs
    [
        "https://i.imgur.com/6eMV4iV.png", "https://i.imgur.com/e5Ynt6y.png", "https://i.imgur.com/XiDIvO4.png",
    
        "https://i.imgur.com/uHehjBx.png", "https://i.imgur.com/nRSqhYi.png", "https://i.imgur.com/TgMLHbl.png",
        
        "https://i.imgur.com/4UThf3N.png", "https://i.imgur.com/kDP9Ujw.png", "https://i.imgur.com/ZxDAMtb.png",
        
        "https://i.imgur.com/0hdTjHq.png", "https://i.imgur.com/7Ur6SH1.png", "https://i.imgur.com/C89syN2.png",
        
        "https://i.imgur.com/Wff4ZhX.png", "https://i.imgur.com/n2qIJTV.png", "https://i.imgur.com/cxu2m8w.png",
    
        "https://i.imgur.com/utm3Dz0.png", "https://i.imgur.com/VIB7RXq.png", "https://i.imgur.com/bmWTakR.png"
    ],

    //Hp Values
    [
        400, 800, 200,
        700, 300, 600,
        900, 1000, 700,
        700, 500, 800,
        2000, 2000, 2000,
        900, 900, 900   
    ],

    //Attck Damage
    [
        100, 500, 200,
        300, 100, 300,
        400, 1000, 400,
        400, 500, 300,
        100, 100, 10,
        600, 600, 600   
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