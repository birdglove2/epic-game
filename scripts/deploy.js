const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['Leo', 'Aang', 'Pikachu'],
    [
      'https://i.imgur.com/pKd5Sdk.png',
      'https://i.imgur.com/xVu4vFL.png',
      'https://i.imgur.com/WMB6g9u.png',
    ],
    [100, 200, 300],
    [100, 50, 25],
    // Big Boss
    'Elon Musk',
    'https://i.imgur.com/AksR0tt.png',
    10000,
    50
  );

  await gameContract.deployed();
  console.log('Contract deployed to:', gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.log('Minted NFT #1');

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log('Minted NFT #2');

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log('Minted NFT #3');

  console.log('Done deploying and minting!');

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

runMain();
