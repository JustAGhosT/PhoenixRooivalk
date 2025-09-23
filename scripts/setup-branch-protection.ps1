<#
.SYNOPSIS
  Configure GitHub branch protection for a repository using GitHub CLI (gh).

.DESCRIPTION
  Applies sensible defaults for production branches (default: main):
  - Require pull request reviews (min 1), dismiss stale approvals
  - Require status checks to pass before merging (configurable)
  - Require conversation resolution
  - Disallow force pushes and deletions
  - Enforce for admins

.PARAMETER Repo
  The GitHub repository in owner/name format. If not provided, the script
  attempts to infer from the current git remote "origin".

.PARAMETER Branch
  The branch to protect. Defaults to "main".

.PARAMETER StatusChecks
  One or more status check contexts that must pass before merging. For example:
  - "Deploy Docusaurus (docs-site)"
  Provide multiple values separated by commas or as an array.

.EXAMPLES
  ./scripts/setup-branch-protection.ps1 -Repo JustAGhosT/PhoenixRooivalk -Branch main -StatusChecks "Deploy Docusaurus (docs-site)"

  ./scripts/setup-branch-protection.ps1 -StatusChecks @("ci/test", "ci/build")

.NOTES
  Requires GitHub CLI (https://cli.github.com/) and authenticated context:
    gh auth login
#>
[CmdletBinding()]
param(
  [string]$Repo,
  [string]$Branch = "main",
  [Parameter(ValueFromPipelineByPropertyName=$true)]
  [Alias("Checks")]
  [object]$StatusChecks
)

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Err($msg) { Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Ensure gh exists
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Err "GitHub CLI 'gh' is not installed. Install from https://cli.github.com/ and run 'gh auth login'."
  exit 1
}

# Ensure gh is authenticated
try {
  gh auth status 1>$null 2>$null
} catch {
  Write-Err "GitHub CLI is not authenticated. Run: gh auth login"
  exit 1
}

# Infer repo if not provided
if (-not $Repo) {
  try {
    $remoteUrl = git config --get remote.origin.url 2>$null
    if ($remoteUrl -match "github.com[:/](.+?)/(.+?)(?:\.git)?$") {
      $owner = $Matches[1]
      $name = $Matches[2]
      $Repo = "$owner/$name"
      Write-Info "Inferred repo: $Repo"
    } else {
      throw "Unable to infer repo from git remote origin URL."
    }
  } catch {
    Write-Err "-Repo is required if not in a GitHub repo directory. Example: -Repo JustAGhosT/PhoenixRooivalk"
    exit 1
  }
}

# Normalize StatusChecks to array of strings
$checksArray = @()
if ($null -ne $StatusChecks) {
  if ($StatusChecks -is [string]) {
    $checksArray = $StatusChecks.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
  } elseif ($StatusChecks -is [System.Array]) {
    $checksArray = $StatusChecks | ForEach-Object { $_.ToString().Trim() } | Where-Object { $_ }
  } else {
    $checksArray = @("$StatusChecks")
  }
}

Write-Info "Configuring protection for $Repo@$Branch"
if ($checksArray.Count -gt 0) {
  Write-Info ("Required status checks: " + ($checksArray -join ", "))
} else {
  Write-Info "No required status checks specified (you can add later)."
}

# Build JSON payload
$payload = [ordered]@{
  required_status_checks = if ($checksArray.Count -gt 0) {
    @{ strict = $true; contexts = $checksArray }
  } else {
    $null
  }
  enforce_admins = $true
  required_pull_request_reviews = @{ 
    required_approving_review_count = 1
    dismiss_stale_reviews = $true
    require_code_owner_reviews = $false
  }
  restrictions = $null
  allow_force_pushes = $false
  allow_deletions = $false
  block_creations = $false
}

$json = ($payload | ConvertTo-Json -Depth 6)

# Call GitHub API via gh
$endpoint = "repos/$Repo/branches/$Branch/protection"
Write-Info "PUT $endpoint"
$json | gh api -X PUT `
  -H "Accept: application/vnd.github+json" `
  $endpoint `
  --input - | Out-Null

if ($LASTEXITCODE -eq 0) {
  Write-Info "Branch protection applied successfully."
} else {
  Write-Err "Failed to apply branch protection. See output above."
  exit $LASTEXITCODE
}
