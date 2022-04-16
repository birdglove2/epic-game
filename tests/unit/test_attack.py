from brownie import network, exceptions
from scripts.deploy_epic_game import deploy_epic_game, deploy_and_mint
from scripts.helpful_scripts import (
    get_account,
    get_contract,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
)
import pytest


def test_attack_with_different_crit_chance():
    assert test_attack_with_crit_chance(777) == 7
    assert test_attack_with_crit_chance(999) == 9
    assert test_attack_with_crit_chance(0) == 0
    assert test_attack_with_crit_chance(123) == 3


def test_attack_with_crit_chance(random_number=100):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_and_mint(account)

    attack_tx = epic_game.attackBoss({"from": account})
    attack_tx.wait(1)
    requestId = attack_tx.events["AttackInitiate"]["requestId"]

    fulfill_attack_tx = get_contract("vrf_coordinator").callBackWithRandomness(
        requestId, random_number, epic_game.address, {"from": get_account()}
    )
    fulfill_attack_tx.wait(1)
    newBossHp = fulfill_attack_tx.events["AttackComplete"]["newBossHp"]
    newPlayerHp = fulfill_attack_tx.events["AttackComplete"]["newPlayerHp"]

    (_, _, _, playerHp, playerMaxHp, playerAttackDamage) = epic_game.getUserNFT(
        {"from": account}
    )
    (_, _, bossHp, bossMaxHp, bossAttackDamage) = epic_game.getBigBoss()

    critChance = epic_game.critChance()
    assert critChance == random_number % 10

    damage = playerAttackDamage
    if critChance >= 9:
        damage = playerAttackDamage * 3
    elif 6 <= critChance <= 8:
        damage = playerAttackDamage * 2

    assert playerHp == newPlayerHp == playerMaxHp - bossAttackDamage
    assert bossHp == newBossHp == bossMaxHp - damage
    return critChance


def test_cannot_attack_if_not_player():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_epic_game(account)
    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.attackBoss({"from": account})


def test_dead_nft_cannot_attack():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_and_mint(account)

    (_, _, _, _, playerMaxHp, _) = epic_game.getUserNFT({"from": account})
    (_, _, _, _, bossAttackDamage) = epic_game.getBigBoss()
    count = playerMaxHp // bossAttackDamage
    for _ in range(count):
        epic_game.attackBoss({"from": account})

    (_, _, _, playerHp, _, _) = epic_game.getUserNFT({"from": account})
    assert playerHp == 0

    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.attackBoss({"from": account})
    return epic_game
