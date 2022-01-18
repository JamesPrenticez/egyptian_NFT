const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('NFTGame');
  const gameContract = await gameContractFactory.deploy(
  ["Ma'at", "Tutankhamun", "Set"],
  ["https://i.imgur.com/uHehjBx.png", "https://i.imgur.com/kDP9Ujw.png", "https://i.imgur.com/4UThf3N.png"],
  [400, 600, 1000],
  [100, 300, 100],
  "Ammit - Devourer of Souls - Eater of Hearts",
  "https://i.imgur.com/bJiNLrt.png",
  25000,
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