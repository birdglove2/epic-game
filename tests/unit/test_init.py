from brownie import network, exceptions
from scripts.deploy_epic_game import deploy_epic_game, deploy_and_mint
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from scripts.game_detail import DEFAULT_CHARACTERS, BOSS
import pytest


def test_init_boss_and_default_characters_successfully():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    epic_game = deploy_epic_game()
    assert DEFAULT_CHARACTERS == epic_game.getDefaultCharacters()

    (
        bossName,
        bossImageURI,
        bossHp,
        bossMaxHp,
        bossAttackDamage,
    ) = epic_game.getBigBoss()

    assert bossName == BOSS[0]
    assert bossImageURI == BOSS[1]
    assert bossHp == BOSS[2]
    assert bossMaxHp == BOSS[3]
    assert bossAttackDamage == BOSS[4]
