import unittest
import importlib.util

from backend.services.blockchain.pool import ProviderFactory

WEB3_AVAILABLE = importlib.util.find_spec("web3") is not None

@unittest.skipUnless(WEB3_AVAILABLE, "web3 not available in this environment")
class TestProviderPooling(unittest.TestCase):
    def test_same_endpoint_network_reuses_web3(self):
        factory = ProviderFactory()
        w3a = factory.get_web3("http://localhost:8545", "etherlink-mainnet")
        w3b = factory.get_web3("http://localhost:8545", "etherlink-mainnet")
        self.assertIs(w3a, w3b)

    def test_different_networks_do_not_reuse(self):
        factory = ProviderFactory()
        w3a = factory.get_web3("http://localhost:8545", "etherlink-mainnet")
        w3b = factory.get_web3("http://localhost:8545", "etherlink-testnet")
        self.assertIsNot(w3a, w3b)


if __name__ == "__main__":
    unittest.main()
