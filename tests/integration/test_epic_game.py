from brownie import network, EpicGame
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    fund_with_link,
)
from scripts.game_detail import DEFAULT_CHARACTERS
import pytest
import time


# 1. attack
# 2. revive
# 3. repeat attack
def test_mint_and_attack_successfully():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for integration testing!")

    epic_game = EpicGame[-1]
    account = get_account()

    # check if user has NFT
    if not epic_game.isUserHasNFT(account):
        # mint
        (index1, name1, imageURI1, hp1, maxHp1, attackDamage1) = DEFAULT_CHARACTERS[1]
        tx = epic_game.mintCharacterNFT(index1, {"from": account})
        tx.wait(1)

        (
            characterIndex,
            name,
            imageURI,
            hp,
            maxHp,
            attackDamage,
        ) = epic_game.getUserNFT(account)
        assert characterIndex == 1
        assert name == name1
        assert imageURI == imageURI1
        assert hp == hp1
        assert maxHp == maxHp1
        assert attackDamage == attackDamage1

    # attack

    # fund with link
    tx = fund_with_link(epic_game.address, account=account, amount=0.25)
    tx.wait(1)

    (_, _, _, oldPlayerHp, _, _) = epic_game.getUserNFT(account)
    (_, _, oldBossHp, _, _) = epic_game.getBigBoss()

    tx = epic_game.attackBoss({"from": account})
    tx.wait(1)
    time.sleep(120)  # wait for fulfill

    (_, _, _, playerHp, _, playerAttackDamage) = epic_game.getUserNFT(account)
    (_, _, bossHp, _, bossAttackDamage) = epic_game.getBigBoss()
    critChance = epic_game.critChance()

    damage = playerAttackDamage
    if critChance >= 8:
        damage = playerAttackDamage * 3
    elif 5 <= critChance <= 7:
        damage = playerAttackDamage * 2

    print(critChance, damage, bossHp, oldBossHp)
    assert playerHp == oldPlayerHp - bossAttackDamage
    assert bossHp == oldBossHp - damage
