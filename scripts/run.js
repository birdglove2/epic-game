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
    [100, 50, 25]
  );
  await gameContract.deployed();
  console.log('Contract deployed to:', gameContract.address);
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
