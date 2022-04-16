from brownie import EpicGame, config, network
from scripts.helpful_scripts import get_account, get_contract, fund_with_link
from scripts.game_detail import BOSS, DEFAULT_CHARACTERS


def deploy_and_mint(account=None):
    epic_game = deploy_epic_game(account)
    tx = epic_game.mintCharacterNFT(1, {"from": account})
    tx.wait(1)
    return epic_game


def deploy_epic_game(account=None):
    account = account if account else get_account()

    epic_game = EpicGame.deploy(
        get_contract("vrf_coordinator"),
        get_contract("link_token"),
        config["networks"][network.show_active()]["keyhash"],
        config["networks"][network.show_active()]["fee"],
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    print("Deployed Epic Game!")

    tx = epic_game.initBoss(BOSS, {"from": account})
    tx.wait(1)
    print("Initialized Boss!")

    tx = epic_game.initDefaultCharacters(DEFAULT_CHARACTERS, {"from": account})
    tx.wait(1)
    print("Initialized Default Characters!")

    fund_with_link(epic_game.address, amount=1)

    return epic_game


def main():
    deploy_epic_game()
