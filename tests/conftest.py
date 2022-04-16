import pytest
from brownie import (
    accounts,
    config,
    network,
)
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
)


@pytest.fixture
def chainlink_fee():
    return 2500000000000000000
