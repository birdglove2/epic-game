from brownie import network, exceptions
from scripts.deploy_epic_game import deploy_epic_game, deploy_and_mint
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from scripts.attack import attack_til_boss_dead
from test_attack import test_cannot_attack_with_dead_nft
import pytest


def test_revive_dead_nft():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = test_cannot_attack_with_dead_nft()

    tx = epic_game.revive({"from": account})
    newPlayerHp = tx.events["ReviveComplete"]["newPlayerHp"]
    (_, _, _, playerHp, playerMaxHp, _) = epic_game.getUserNFT(account)
    assert playerHp == playerMaxHp / 2 == newPlayerHp


def test_cannot_revive_alive_nft():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_and_mint(account)
    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.revive({"from": account})


def test_cannot_revive_if_not_player():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_epic_game()
    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.revive({"from": account})


def test_revive_boss():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_and_mint(account)

    attack_til_boss_dead(epic_game, account)
    (_, _, oldBossHp, oldBossMaxHp, oldBossAttackDamage) = epic_game.getBigBoss()
    assert oldBossHp == 0

    tx = epic_game.reviveBigBoss({"from": account})
    tx.wait(1)
    (_, _, bossHp, _, bossAttackDamage) = epic_game.getBigBoss()
    assert bossHp > 0
    assert bossAttackDamage == 2 * oldBossAttackDamage


def test_cannot_revive_boss_if_not_owner():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_and_mint(account)

    attack_til_boss_dead(epic_game, account)
    (_, _, oldBossHp, _, _) = epic_game.getBigBoss()
    assert oldBossHp == 0
    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.reviveBigBoss({"from": get_account(index=2)})


def test_cannot_revive_boss_if_boss_alive():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = deploy_and_mint(account)
    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.reviveBigBoss({"from": account})
