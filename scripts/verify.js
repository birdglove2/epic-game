const main = async () => {
  await hre.run('verify:verify', {
    address: '0xECF765F923Ac195D7453Ff2C07d6b223239Fe6e8',
    constructorArguments: [
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
      50,
    ],
  });
};
main();
