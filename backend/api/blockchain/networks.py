"""
Network address format metadata for various blockchain types.

Provides developer-facing documentation and a helper to retrieve address
format and example values per supported chain.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, TypedDict

from .evm_address import validate_evm_address, to_eip55


# Address format guidance
#
# Ethereum / EtherLink (EVM):
# - Format: 0x-prefixed, hex-encoded, 20-byte addresses => 40 hex chars + "0x" => 42 chars total.
# - Example: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
# - Validation notes:
#   - Must start with "0x".
#   - Length must be exactly 42 characters.
#   - Characters 2..41 must be [0-9a-fA-F].
#   - Optional: enforce EIP-55 checksum when validating user input.
#
# Solana:
# - Format: Base58-encoded public keys; decodes to 32 bytes (length varies, commonly 43–44 chars).
# - Example: 4Nd1mY3iQz9dKqG2m9X3pQxvGXn3a6TT5p7H1cDJ5b5P
# - Validation notes:
#   - Base58 alphabet only (no 0,O,I,l,+,/ etc.).
#   - Must decode to exactly 32 bytes.
#   - Do not assume a fixed string length.
#
# Developer guidance:
# - Expose both "address_format" and "address_example" in API responses.
# - Validate server-side before accepting addresses.
# - For EVM addresses, prefer checksum-validated format; normalize as needed.
# - For Solana, Base58-decode and verify 32-byte length.
#
# Example API response shape (EVM):
# {
#   "chain": "etherlink",
#   "address_format": "0x-prefixed hex (42 chars, 20 bytes). EIP-55 checksum recommended.",
#   "address_example": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
# }
#
# Example API response shape (Solana):
# {
#   "chain": "solana",
#   "address_format": "Base58 encoded, decodes to 32 bytes (length varies).",
#   "address_example": "4Nd1mY3iQz9dKqG2m9X3pQxvGXn3a6TT5p7H1cDJ5b5P"
# }


@dataclass(frozen=True)
class AddressMetadata:
    address_format: str
    address_example: str


_EVM_ADDRESS = AddressMetadata(
    address_format="0x-prefixed hex (42 chars, 20 bytes). EIP-55 checksum recommended.",
    address_example="0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
)

_SOLANA_ADDRESS = AddressMetadata(
    address_format="Base58 encoded; decodes to exactly 32 bytes (length varies).",
    address_example="4Nd1mY3iQz9dKqG2m9X3pQxvGXn3a6TT5p7H1cDJ5b5P",
)

# Map common chain identifiers to metadata. Extend as needed.
_CHAIN_MAP: Dict[str, AddressMetadata] = {
    # EVM family
    "ethereum": _EVM_ADDRESS,
    "etherlink": _EVM_ADDRESS,
    "evm": _EVM_ADDRESS,
    # Solana family
    "solana": _SOLANA_ADDRESS,
}


def get_address_metadata(chain: str) -> AddressMetadata:
    """Return address metadata for a given chain identifier.

    Chain matching is case-insensitive and supports common synonyms.
    Raises KeyError for unsupported chains.
    """
    key = (chain or "").strip().lower()
    if key not in _CHAIN_MAP:
        raise KeyError(f"Unsupported chain: {chain!r}")
    return _CHAIN_MAP[key]


class EvmAddressInfo(TypedDict):
    chain: str
    address_format: str
    address_example: str
    normalized_address: str
    checksum_valid: bool
    validation_reason: str


def get_evm_address_info(address: str, *, require_checksum: bool = False) -> EvmAddressInfo:
    """Return EVM address metadata along with an EIP-55 normalized address.

    - Validates the input according to EVM rules.
    - Produces `normalized_address` as EIP-55 if possible (raises if address is malformed).
    - `checksum_valid` reflects whether the provided address matches EIP-55 checksum when
      require_checksum=True; if False, basic hex validation is applied only.
    """
    meta = _EVM_ADDRESS
    check = validate_evm_address(address, require_checksum=require_checksum)

    if not check.is_valid:
        # Provide best-effort normalization error reason
        normalized = ""
        reason = check.reason
        checksum_valid = False
    else:
        normalized = to_eip55(address)
        # If checksum is required, then is_valid already implies it's checksum-correct
        # If not required, compute whether original matched checksum for developer insight
        checksum_valid = validate_evm_address(address, require_checksum=True).is_valid
        reason = ""

    return EvmAddressInfo(
        chain="evm",
        address_format=meta.address_format,
        address_example=meta.address_example,
        normalized_address=normalized,
        checksum_valid=checksum_valid,
        validation_reason=reason,
    )
