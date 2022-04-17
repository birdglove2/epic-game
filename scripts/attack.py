from brownie import EpicGame, network
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS


def attack(epic_game=None, account=get_account):
    attack_tx = epic_game.attackBoss({"from": account})
    attack_tx.wait(1)
    newPlayerHp = attack_tx.events["AttackComplete"]["newPlayerHp"]
    newBossHp = attack_tx.events["AttackComplete"]["newBossHp"]
    return newPlayerHp, newBossHp


def attack_til_boss_dead(epic_game=None, account=get_account):
    (_, _, bossHp, _, _) = epic_game.getBigBoss()
    while bossHp > 0:
        playerHp, bossHp = attack(epic_game, account)
        if playerHp == 0:
            epic_game.revive({"from": account})


def attack_til_player_dead(epic_game=None, account=get_account):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        epic_game = EpicGame[-1]
    else:
        if epic_game == None:
            return

    (_, _, _, playerHp, _, _) = epic_game.getUserNFT(account)
    while playerHp > 0:
        playerHp, _ = attack(epic_game, account)


def main():
    attack_til_player_dead()
