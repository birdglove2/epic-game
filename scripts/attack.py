from brownie import EpicGame
from scripts.helpful_scripts import get_account


def attack_til_dead():
    epic_game = EpicGame[-1]
    account = get_account()

    (_, _, _, playerHp, _, _) = epic_game.getUserNFT(account)
    while playerHp > 0:
        attack_tx = epic_game.attackBoss({"from": account})
        attack_tx.wait(1)
        newPlayerHp = attack_tx.events["AttackComplete"]["newPlayerHp"]
        playerHp = newPlayerHp


def main():
    attack_til_dead()
