npx hardhat run scripts/run.js
npx hardhat run scripts/deploy.js --network rinkeby

Contract deployed to: 0x4b8A189189f8c1d3B3E7bDE7E6B32004580D3889 24/02/2022

https://rinkeby.etherscan.io/address/0x4b8A189189f8c1d3B3E7bDE7E6B32004580D3889

Make sure the frontend/utils/constants match the current contact address

Copy the latest ABI file from the backend/artifacts/contracts/NFTGame.json , paste it into frontend/utils/NFTGameABI.json. (Later, we will delve more into what an ABI is).

https://testnets.opensea.io/assets/0x4b8A189189f8c1d3B3E7bDE7E6B32004580D3889/1