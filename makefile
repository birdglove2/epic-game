deploy:
	- brownie run scripts/deploy_epic_game.py --network rinkeby

test-int:
	- brownie test --network rinkeby
