// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './libraries/Base64.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';

contract EpicGame is ERC721 {
  // The tokenId is the NFTs unique identifier, it's just a number that goes 1, 2, 3, ...
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address public owner;
  BigBoss public bigBoss;
  struct BigBoss {
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  struct CharacterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  // uint256 public critChance;

  // For VRFCoordinator
  bytes32 internal keyHash;
  uint256 internal oracleFee;

  // A lil array to help us hold the default data for our characters.
  // This will be helpful when we mint new characters and need to know
  // things like their HP, AD, etc.
  CharacterAttributes[] defaultCharacters;

  //  nft's tokenId => that NFTs attributes.
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

  // A mapping from an address => the NFTs tokenId. Gives me an ez way
  // to store the owner of the NFT and reference it later.
  mapping(address => uint256) public nftHolders;

  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event AttackComplete(uint256 newBossHp, uint256 newPlayerHp, uint256 damage, uint8 critChance);
  event ReviveComplete(address sender, uint256 newPlayerHp);

  constructor() ERC721('Pokemon', 'POKEMON') {
    owner = msg.sender;
    _tokenIds.increment(); // just make it starts at 1 instead of 0
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'You are not the owner');
    _;
  }

  function initBoss(BigBoss memory boss) public onlyOwner {
    bigBoss = BigBoss({
      name: boss.name,
      imageURI: boss.imageURI,
      hp: boss.hp,
      maxHp: boss.maxHp,
      attackDamage: boss.attackDamage
    });
  }

  function initDefaultCharacters(CharacterAttributes[] memory characters) public onlyOwner {
    for (uint256 i = 0; i < characters.length; i += 1) {
      defaultCharacters.push(
        CharacterAttributes({
          characterIndex: characters[i].characterIndex,
          name: characters[i].name,
          imageURI: characters[i].imageURI,
          hp: characters[i].hp,
          maxHp: characters[i].maxHp,
          attackDamage: characters[i].attackDamage
        })
      );
    }
  }

  modifier onlyPlayer() {
    require(isUserHasNFT(msg.sender) == true, "You're not the player!");
    _;
  }

  function isUserHasNFT(address _user) public view returns (bool) {
    uint256 tokenId = nftHolders[_user];
    if (tokenId > 0) {
      return true;
    }
    return false;
  }

  // Users would be able to hit this function and get their NFT based on the
  // characterId they send in!
  function mintCharacterNFT(uint256 _characterIndex) external {
    require(isUserHasNFT(msg.sender) == false, 'User already has a NFT');
    uint256 newItemId = _tokenIds.current();
    _safeMint(msg.sender, newItemId);

    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].maxHp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    // Keep an easy way to see who owns what NFT.
    nftHolders[msg.sender] = newItemId;

    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);

    // Increment the tokenId for the next person that uses it.
    _tokenIds.increment();
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "An epic NFT", "image": "ipfs://',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',
            strHp,
            ', "max_value":',
            strMaxHp,
            '}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,
            '} ]}'
          )
        )
      )
    );

    string memory output = string(abi.encodePacked('data:application/json;base64,', json));
    return output;
  }

  function attackBoss() public onlyPlayer {
    // Get the state of the player's NFT.
    uint256 tokenId = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[tokenId];
    require(player.hp > 0, 'player has no HP left');
    require(bigBoss.hp > 0, 'Big Boss is already dead');

    // calculate critical damage
    (uint256 damage, uint8 critChance) = calculateCriticalDamage(player.attackDamage);

    // Allow player to attack boss with critable damage
    if (bigBoss.hp < damage) {
      bigBoss.hp = 0;
    } else {
      bigBoss.hp = bigBoss.hp - damage;
    }

    // Allow boss to attack player.
    if (player.hp < bigBoss.attackDamage) {
      player.hp = 0;
    } else {
      player.hp = player.hp - bigBoss.attackDamage;
    }

    emit AttackComplete(bigBoss.hp, player.hp, damage, critChance);
  }

  function calculateCriticalDamage(uint256 _damage) internal view returns (uint256, uint8) {
    uint8 critChance = uint8(random() % 10);
    uint256 damage = _damage;
    if (critChance >= 8) {
      damage = _damage * 3;
    } else if (critChance >= 5 && critChance <= 7) {
      damage = _damage * 2;
    }
    return (damage, critChance);
  }

  // revive dead NFT with half of its maxHP
  function revive() public onlyPlayer {
    uint256 tokenId = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[tokenId];
    require(player.hp == 0, 'Cannot revive an alive NFT');
    player.hp = player.maxHp / 2;
    emit ReviveComplete(msg.sender, player.hp);
  }

  // revive and level up boss
  function reviveBigBoss() public onlyOwner {
    require(bigBoss.hp == 0, 'Cannot revive an alive Boss');
    bigBoss.hp = bigBoss.maxHp / 2;
    bigBoss.attackDamage = bigBoss.attackDamage * 2;
  }

  function getUserNFT(address _user) public view returns (CharacterAttributes memory) {
    uint256 tokenId = nftHolders[_user];
    if (tokenId > 0) {
      return nftHolderAttributes[tokenId];
    } else {
      CharacterAttributes memory emptyStruct;
      return emptyStruct;
    }
  }

  function getDefaultCharacters() public view returns (CharacterAttributes[] memory) {
    return defaultCharacters;
  }

  function getBigBoss() public view returns (BigBoss memory) {
    return bigBoss;
  }

  function random() public view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
  }
}
