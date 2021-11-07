const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('NFTGame0');
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
          40, 80, 20,
          70, 30, 60,
          90, 100, 70,
          70, 50, 80,
          200, 200, 200,
          90, 90, 90   
      ],

      //Attck Damage
      [
          10, 50, 20,
          30, 10, 30,
          40, 100, 40,
          40, 50, 30,
          1, 1, 1,
          60, 60, 60   
      ],

      //Exp
      [
          0, 0, 0, 
          0, 0, 0,
          0, 0, 0,
          0, 0, 0,
          0, 0, 0,
          0, 0, 0   
      ],
      //Boss Name
      "Ammit - Devourer of Souls - Eater of Hearts",
      //Boss Image
      "https://i.imgur.com/bJiNLrt.png",
      //Boss HP
      1000,
      //Boss attack damage
      25
  );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

    let txn;
    // We only have three characters.
    // an NFT w/ the character at index 2 of our array.
    txn = await gameContract.mintCharacterNFT(0);
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();



    // Get the value of the NFT's URI.
    let returnedTokenUri = await gameContract.tokenURI(1);
    console.log("Token URI:", returnedTokenUri);
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