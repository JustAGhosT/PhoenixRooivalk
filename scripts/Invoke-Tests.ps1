<#
.SYNOPSIS
    Runs pytest for backend tests.

.DESCRIPTION
    Thin wrapper around pytest to execute tests under backend/tests.

.PARAMETER Marker
    Optional pytest -m marker expression (e.g., unit or "not slow").

.PARAMETER Quiet
    If set, runs pytest with -q.

.EXAMPLE
    ./scripts/Invoke-Tests.ps1

.EXAMPLE
    ./scripts/Invoke-Tests.ps1 -Marker unit -Quiet
#>
[CmdletBinding()]
param(
    [string]$Marker = "",
    [switch]$Quiet
)

$pytestArgs = @()
if ($Quiet) { $pytestArgs += "-q" }
if ($Marker -ne "") { $pytestArgs += @("-m", $Marker) }
$pytestArgs += @("backend/tests")

# Validate prerequisites
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    throw "Python is not available in PATH"
}

if (!(Test-Path "backend/tests")) {
    throw "Backend tests directory not found: backend/tests"
}

# Prefer python -m pytest for venv compatibility
python -m pytest @pytestArgs
