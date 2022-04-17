from brownie import network, exceptions, EpicGame
from scripts.deploy_epic_game import deploy_epic_game, deploy_and_mint
from scripts.helpful_scripts import (
    get_account,
    get_contract,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
)
import pytest


def attack(account, epic_game):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    attack_tx = epic_game.attackBoss({"from": account})
    attack_tx.wait(1)
    return attack_tx


def test_attack_with_crit_chance():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_and_mint(account)

    attack_tx = attack(account, epic_game)
    newBossHp = attack_tx.events["AttackComplete"]["newBossHp"]
    newPlayerHp = attack_tx.events["AttackComplete"]["newPlayerHp"]

    (_, _, _, playerHp, playerMaxHp, playerAttackDamage) = epic_game.getUserNFT(account)
    (_, _, bossHp, bossMaxHp, bossAttackDamage) = epic_game.getBigBoss()

    # critChance = epic_game.critChance()
    # damage = playerAttackDamage
    # if critChance >= 8:
    #     damage = playerAttackDamage * 3
    # elif 5 <= critChance <= 7:
    #     damage = playerAttackDamage * 2

    assert playerHp == newPlayerHp  # == playerMaxHp - bossAttackDamage
    assert bossHp == newBossHp  # == bossMaxHp - damage
    # return critChance


def test_cannot_attack_if_not_player():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_epic_game(account)
    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.attackBoss({"from": account})


def test_cannot_attack_with_dead_nft():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_and_mint(account)

    (_, _, _, _, playerMaxHp, _) = epic_game.getUserNFT(account)
    (_, _, _, _, bossAttackDamage) = epic_game.getBigBoss()

    # how many times player can attack before die
    count = playerMaxHp // bossAttackDamage
    for _ in range(count):
        attack(account, epic_game)

    (_, _, _, playerHp, _, _) = epic_game.getUserNFT(account)
    assert playerHp == 0

    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.attackBoss({"from": account})
    return epic_game
