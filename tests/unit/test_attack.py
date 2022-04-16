from brownie import network, exceptions
from scripts.deploy_epic_game import deploy_epic_game, deploy_and_mint
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
import pytest


def test_attack_successfully():
    pass


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
