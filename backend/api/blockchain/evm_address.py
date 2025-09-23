"""
EVM (Ethereum/EtherLink) address validation and normalization utilities.

- validate_evm_address: strict validation with optional EIP-55 checksum enforcement
- to_eip55: convert a hex address to EIP-55 checksum case
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple

try:
    from eth_utils import is_checksum_address, to_checksum_address  # type: ignore
except Exception:  # eth_utils not installed
    is_checksum_address = None  # type: ignore[assignment]
    to_checksum_address = None  # type: ignore[assignment]


@dataclass(frozen=True)
class AddressCheck:
    is_valid: bool
    reason: str = ""


def _basic_hex_checks(addr: str) -> Tuple[bool, str]:
    if not addr.startswith("0x"):
        return False, "must start with 0x"
    if len(addr) != 42:
        return False, "length must be 42"
    body = addr[2:]
    if not all(c in "0123456789abcdefABCDEF" for c in body):
        return False, "contains non-hex chars"
    return True, ""


def validate_evm_address(addr: str, *, require_checksum: bool = False) -> AddressCheck:
    """
    Validate an EVM address.

    - Always verifies 0x-prefix, 42-char length and hex charset.
    - If require_checksum=True and eth_utils is available, also enforces EIP-55 checksum.
    - If require_checksum=True but eth_utils is missing, returns invalid with a reason.
    """
    if not isinstance(addr, str) or not addr:
        return AddressCheck(False, "empty or not a string")

    ok, reason = _basic_hex_checks(addr)
    if not ok:
        return AddressCheck(False, reason)

    if require_checksum:
        if is_checksum_address is None:
            return AddressCheck(False, "eth_utils not installed for checksum validation")
        if not is_checksum_address(addr):
            return AddressCheck(False, "invalid EIP-55 checksum")

    return AddressCheck(True, "")


def to_eip55(addr: str) -> str:
    """Return the EIP-55 checksummed address (requires eth_utils)."""
    if to_checksum_address is None:
        raise RuntimeError("eth_utils not installed: cannot convert to EIP-55")
    ok, reason = _basic_hex_checks(addr)
    if not ok:
        raise ValueError(f"invalid address: {reason}")
    return to_checksum_address(addr)
