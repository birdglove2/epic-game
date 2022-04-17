from brownie import network, exceptions
from scripts.deploy_epic_game import deploy_epic_game
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from scripts.game_detail import DEFAULT_CHARACTERS
import pytest


def test_user_can_mint_character():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    epic_game = deploy_epic_game()

    account = get_account()

    (index1, name1, imageURI1, hp1, maxHp1, attackDamage1) = DEFAULT_CHARACTERS[1]
    tx = epic_game.mintCharacterNFT(index1, {"from": account})
    tx.wait(1)

    character_attributes = epic_game.getUserNFT(account)
    (characterIndex, name, imageURI, hp, maxHp, attackDamage) = character_attributes

    assert characterIndex == 1
    assert name == name1
    assert imageURI == imageURI1
    assert hp == hp1
    assert maxHp == maxHp1
    assert attackDamage == attackDamage1


def test_user_cannot_mint_character_more_than_one():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    epic_game = deploy_epic_game()

    account = get_account()

    tx = epic_game.mintCharacterNFT(1, {"from": account})
    tx.wait(1)
    with pytest.raises(exceptions.VirtualMachineError):
        epic_game.mintCharacterNFT(1, {"from": account})
