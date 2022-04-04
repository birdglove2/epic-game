const main = async () => {
  await hre.run('verify:verify', {
    address: '0x89378a25200A385B436503EB18B253d49b594860',
    constructorArguments: [
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
      50,
    ],
  });
};
main();
