from brownie import network, exceptions
from scripts.deploy_epic_game import deploy_epic_game, deploy_and_mint
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from test_attack import test_cannot_attack_with_dead_nft
import pytest


def test_revive_dead_nft():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    epic_game = test_cannot_attack_with_dead_nft()

    epic_game.revive({"from": account})
    (_, _, _, playerHp, playerMaxHp, _) = epic_game.getUserNFT(account)
    assert playerHp == playerMaxHp / 2


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
