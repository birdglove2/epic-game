// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './libraries/Base64.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';

contract EpicGame is ERC721, VRFConsumerBase, Ownable {
  // The tokenId is the NFTs unique identifier, it's just a number that goes 1, 2, 3, ...
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

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

  uint256 public critChance;

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
  event AttackInitiate(bytes32 requestId, uint256 critChance);
  event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

  // Data passed in to the contract when it's first created initializing the characters.
  // We're going to actually pass these values in from run.js.
  constructor(
    address _VRFCoordinator,
    address _LinkToken,
    bytes32 _keyHash,
    uint256 _oracleFee
  ) ERC721('Heroes', 'HERO') VRFConsumerBase(_VRFCoordinator, _LinkToken) {
    keyHash = _keyHash;
    oracleFee = _oracleFee;
    _tokenIds.increment(); // just make it starts at 1 instead of 0
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
    require(isUserHasNFT() == true, "You're not the player!");
    _;
  }

  function isUserHasNFT() public view returns (bool) {
    uint256 tokenId = nftHolders[msg.sender];
    if (tokenId > 0) {
      return true;
    }
    return false;
  }

  // Users would be able to hit this function and get their NFT based on the
  // characterId they send in!
  function mintCharacterNFT(uint256 _characterIndex) external {
    require(isUserHasNFT() == false, 'User already has a NFT');
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

    // request for critical chance
    bytes32 requestId = requestRandomness(keyHash, oracleFee);
    emit AttackInitiate(requestId, critChance);
  }

  // fulfill attacking boss with random critical chance
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    // Get the state of the player's NFT.
    uint256 tokenId = nftHolders[tx.origin];
    CharacterAttributes storage player = nftHolderAttributes[tokenId];

    critChance = randomness % 10;

    // calculate critical damage for player
    uint256 damage = player.attackDamage;
    if (critChance >= 9) {
      damage = player.attackDamage * 3;
    } else if (critChance >= 6 && critChance <= 8) {
      damage = player.attackDamage * 2;
    }

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

    emit AttackComplete(bigBoss.hp, player.hp);
  }

  // revive dead NFT with half of its maxHP
  function revive() public onlyPlayer {
    uint256 tokenId = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[tokenId];
    require(player.hp == 0, 'Cannot revive an alive NFT');
    player.hp = player.maxHp / 2;
  }

  function getUserNFT() public view onlyPlayer returns (CharacterAttributes memory) {
    uint256 tokenId = nftHolders[msg.sender];
    return nftHolderAttributes[tokenId];
  }

  function getDefaultCharacters() public view returns (CharacterAttributes[] memory) {
    return defaultCharacters;
  }

  function getBigBoss() public view returns (BigBoss memory) {
    return bigBoss;
  }
}
