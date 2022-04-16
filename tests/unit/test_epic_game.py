from brownie import network, exceptions
from scripts.deploy_epic_game import deploy_epic_game
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from web3 import Web3
import pytest


def test_user_can_mint_character():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    epic_game = deploy_epic_game()

    account = get_account()

    tx = epic_game.mintCharacterNFT(1, {"from": account})
    tx.wait(1)

    character_attributes = epic_game.getUserNFT({"from": account})
    (characterIndex, name, imageURI, hp, maxHp, attackDamage) = character_attributes

    assert characterIndex == 1
    assert name == "Lucario"
    assert imageURI == "QmV4ybsmVyUNdMDfks5qHFtPwiBMoY6iuoY9TPSTWsET5S"
    assert hp == 400
    assert maxHp == 400
    assert attackDamage == 250


def test_user_cannot_mint_character_more_than_one():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    epic_game = deploy_epic_game()

    account = get_account()

    tx = epic_game.mintCharacterNFT(1, {"from": account})
    tx.wait(1)
    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.mintCharacterNFT(1, {"from": account})
