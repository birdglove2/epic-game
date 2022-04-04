const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['Mega Charizard Y', 'Lucario', 'Gengar'],
    [
      'bafybeiffh6fk2hujxi653zjnfe2gtj44ben2xvet5tu67ctc3m64e33c3m',
      'QmV4ybsmVyUNdMDfks5qHFtPwiBMoY6iuoY9TPSTWsET5S',
      'bafybeicvhxo2s5tk2336rsz2dys6blywigexsrgakyz75ynhgdbjo7rhea',
    ],
    [500, 400, 450],
    [250, 250, 300],
    // Big Boss
    'Elon Musk',
    'https://i.imgur.com/AksR0tt.png',
    1000,
    50
  );

  await gameContract.deployed();
  console.log('Contract deployed to:', gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log('Minted NFT #1');

  // txn = await gameContract.mintCharacterNFT(1);
  // await txn.wait();
  // console.log('Minted NFT #2');

  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();
  // console.log('Minted NFT #3');
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
