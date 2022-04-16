from distutils.command.sdist import sdist
from brownie import EpicGame, config, network
from scripts.helpful_scripts import get_account, get_contract, fund_with_link
from web3 import Web3


PRODUCT_DUMMY = {
    "title": "Nike Air Jordan",
    "description": "A very rare shoes",
    "price": Web3.toWei(0.01, "ether"),
}


def deploy_epic_game(account=None):
    account = account if account else get_account()
    epic_game = EpicGame.deploy(
        # default characters
        ["Mega Charizard Y", "Lucario", "Gengar"],
        [
            "bafybeiffh6fk2hujxi653zjnfe2gtj44ben2xvet5tu67ctc3m64e33c3m",
            "QmV4ybsmVyUNdMDfks5qHFtPwiBMoY6iuoY9TPSTWsET5S",
            "bafybeicvhxo2s5tk2336rsz2dys6blywigexsrgakyz75ynhgdbjo7rhea",
        ],
        [500, 400, 450],
        [250, 250, 300],
        # Big Boss
        "Elon Musk",
        "https://i.imgur.com/AksR0tt.png",
        10000,
        50,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    print("Deployed Epic Game!")
    return epic_game


def main():
    deploy_halffin_factory()
    create_product()
