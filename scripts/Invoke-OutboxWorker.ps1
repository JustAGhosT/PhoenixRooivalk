<#
.SYNOPSIS
    Runs the blockchain outbox worker loop.

.DESCRIPTION
    Invokes the Python module backend.workers.outbox_worker. Configure via env vars.

.PARAMETER ProviderEndpoint
    Optional provider endpoint (default: http://localhost)

.PARAMETER ProviderNetwork
    Optional provider network name (default: etherlink-mainnet)

.PARAMETER IntervalSec
    Sleep interval between batches (default: 10)

.PARAMETER BatchLimit
    Max ops per batch (default: 50)

.PARAMETER MaxAttempts
    Max attempts (default: 10)

.EXAMPLE
    ./scripts/Invoke-OutboxWorker.ps1 -ProviderEndpoint "http://localhost" -IntervalSec 5

#>
[CmdletBinding()]
param(
    [string]$ProviderEndpoint = "http://localhost",
    [string]$ProviderNetwork = "etherlink-mainnet",
    [int]$IntervalSec = 10,
    [int]$BatchLimit = 50,
    [int]$MaxAttempts = 10
)

$env:PROVIDER_ENDPOINT = $ProviderEndpoint
$env:PROVIDER_NETWORK = $ProviderNetwork
$env:OUTBOX_INTERVAL_SEC = "$IntervalSec"
$env:OUTBOX_BATCH_LIMIT = "$BatchLimit"
$env:OUTBOX_MAX_ATTEMPTS = "$MaxAttempts"

# Anchoring envs (set externally as needed):
# $env:EVIDENCE_ANCHOR_CHAIN = "solana"
# $env:SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"
# $env:SOLANA_SECRET_KEY = "[ ... ]"  # or file://...
# $env:SOLANA_COMMITMENT = "confirmed"

Write-Host "Starting outbox worker... Ctrl+C to stop."
python -m backend.workers.outbox_worker
