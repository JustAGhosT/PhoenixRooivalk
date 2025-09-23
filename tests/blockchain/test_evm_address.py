import unittest

from backend.api.blockchain.evm_address import validate_evm_address, to_eip55, AddressCheck


class TestEvmAddressValidation(unittest.TestCase):
    def test_basic_hex_rules(self):
        self.assertFalse(validate_evm_address("").is_valid)
        self.assertFalse(validate_evm_address("0x123").is_valid)
        self.assertFalse(validate_evm_address("0xZZZZ0000000000000000000000000000000000").is_valid)
        # Valid length/format (checksum not enforced by default)
        check: AddressCheck = validate_evm_address("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
        self.assertTrue(check.is_valid, check.reason)

    def test_require_checksum(self):
        cased = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"  # known checksummed address
        lower = cased.lower()
        chk_ok = validate_evm_address(cased, require_checksum=True)
        self.assertTrue(chk_ok.is_valid, chk_ok.reason)
        chk_bad = validate_evm_address(lower, require_checksum=True)
        self.assertFalse(chk_bad.is_valid)

    def test_to_eip55(self):
        addr_lower = "0x742d35cc6634c0532925a3b844bc454e4438f44e"
        out = to_eip55(addr_lower)
        self.assertEqual(out, "0x742d35Cc6634C0532925a3b844Bc454e4438f44e")


if __name__ == "__main__":
    unittest.main()
