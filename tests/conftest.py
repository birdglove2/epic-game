import pytest

from scripts.helpful_scripts import (
    get_account,
)


@pytest.fixture
def account():
    return get_account()


@pytest.fixture
def chainlink_fee():
    return 2500000000000000000


@pytest.fixture
def random_number():
    return 100
