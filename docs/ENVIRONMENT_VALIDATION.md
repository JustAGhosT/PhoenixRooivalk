# Environment Variable Validation

This document describes the environment variable validation system used in the Phoenix Rooivalk CI/CD pipeline.

## Overview

The `scripts/validate-env.sh` script validates that required environment variables are set and have valid values before building or deploying applications. This catches configuration errors early in the CI pipeline, preventing cryptic runtime errors like `TypeError: Invalid URL`.

## Problem Statement

Without validation, missing or invalid environment variables can cause:
- Build failures with unclear error messages
- Runtime errors during prerendering (Next.js)
- Invalid URL errors when environment variables are empty strings
- Deployment failures after spending time on builds

## Solution

The validation script checks environment variables at the start of CI workflows, failing fast if any required variables are missing or invalid.

## Usage

### Running Locally

```bash
# Validate docs app environment
./scripts/validate-env.sh docs

# Validate marketing app environment
./scripts/validate-env.sh marketing

# Validate API app environment
./scripts/validate-env.sh api

# Validate keeper app environment
./scripts/validate-env.sh keeper
```

### CI Integration

The validation script is automatically run in CI workflows:
- `.github/workflows/ci-marketing.yml` - Validates before lint/typecheck
- `.github/workflows/deploy-marketing-site.yml` - Validates before build
- `.github/workflows/deploy-docs-site.yml` - Validates before build

## Validation Rules

### Docs App (`apps/docs`)

**Optional Variables:**
- `ENV_NAME` - Environment name (defaults to 'local')
- `DEPLOY_CONTEXT` - Deployment context
- `CONTEXT` - Build context
- `BRANCH` - Git branch name
- `GITHUB_HEAD_REF` - PR head reference
- `GITHUB_REF_NAME` - GitHub ref name
- `MARKETING_URL` - Marketing site URL (must be valid URL if set, empty string will fail)

**Validation:**
- If `MARKETING_URL` is set, it must be a valid URL (start with `http://` or `https://`)
- Empty string values are rejected (will cause `Invalid URL` errors)

### Marketing App (`apps/marketing`)

**Optional Variables:**
- `NODE_ENV` - Node environment (defaults to 'development')
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Plausible analytics domain
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics measurement ID

**Validation:**
- All variables are optional for the marketing app
- If analytics variables are set, they are logged

### API App (`apps/api`)

**Required Variables:**
- `API_DB_URL` OR `DATABASE_URL` - Database connection URL
  - Must start with `sqlite://`, `postgresql://`, or `postgres://`

**Optional Variables:**
- `PORT` - Server port (defaults to 8080)
- `RUST_LOG` - Log level (defaults to 'info')

### Keeper App (`apps/keeper`)

**Required Variables:**
- `KEEPER_DB_URL` OR `DATABASE_URL` - Database connection URL
  - Must start with `sqlite://`, `postgresql://`, or `postgres://`

**Optional Variables:**
- `KEEPER_PROVIDER` - Provider type ('etherlink', 'solana', 'multi', or 'stub')
- `ETHERLINK_ENDPOINT` - Etherlink RPC endpoint (required if provider is 'etherlink' or 'multi')
- `ETHERLINK_NETWORK` - Etherlink network (defaults to 'ghostnet')
- `ETHERLINK_PRIVATE_KEY` - Etherlink private key
- `SOLANA_ENDPOINT` - Solana RPC endpoint (required if provider is 'solana' or 'multi')
- `SOLANA_NETWORK` - Solana network (defaults to 'devnet')

## Common Validation Errors

### Invalid URL Error

**Error Message:**
```
ERROR: MARKETING_URL='https://' is invalid (URL is incomplete)
```

**Cause:** Environment variable is set to an incomplete URL

**Solution:** Either unset the variable or provide a complete URL:
```bash
# Unset the variable
unset MARKETING_URL

# Or set a valid URL
export MARKETING_URL="https://phoenixrooivalk.netlify.app"
```

### Empty String Error

**Error Message:**
```
ERROR: MARKETING_URL is set but empty (this will cause 'Invalid URL' errors)
```

**Cause:** Environment variable is set to an empty string (`MARKETING_URL=""`)

**Solution:** Unset the variable instead:
```bash
unset MARKETING_URL
```

### Missing Required Variable

**Error Message:**
```
ERROR: Neither API_DB_URL nor DATABASE_URL is set (one is required)
```

**Cause:** Required database URL is not set

**Solution:** Set one of the required environment variables:
```bash
export API_DB_URL="sqlite://./test.db"
# or
export DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

## Extending Validation

To add validation for a new app:

1. Add a new case to the `validate_env()` function in `scripts/validate-env.sh`
2. Use helper functions:
   - `validate_url()` - Validates URL format
   - `validate_db_url()` - Validates database URL format
   - `log_error()` - Logs an error (increments error count)
   - `log_warning()` - Logs a warning (increments warning count)
   - `log_success()` - Logs a success message
   - `log_info()` - Logs an informational message
3. Add the validation step to relevant CI workflows

Example:
```yaml
- name: Validate environment variables
  run: |
    chmod +x ./scripts/validate-env.sh
    ./scripts/validate-env.sh myapp
```

## Troubleshooting

### Script Not Executable

If you get "Permission denied" errors:
```bash
chmod +x scripts/validate-env.sh
```

### Wrong Working Directory

If the script can't be found in CI:
```yaml
# From repository root
./scripts/validate-env.sh docs

# From subdirectory (e.g., apps/docs)
../../scripts/validate-env.sh docs
```

### False Positives

If the validation is failing incorrectly, check:
1. Environment variables are properly exported
2. URLs have the correct format (must start with `http://` or `https://`)
3. Database URLs use the correct protocol (`sqlite://`, `postgresql://`, or `postgres://`)

## Benefits

1. **Fail Fast**: Catch configuration errors before spending time on builds
2. **Clear Error Messages**: Specific error messages instead of cryptic runtime errors
3. **Early Detection**: Validate at the start of CI pipelines
4. **Documentation**: Self-documenting validation rules
5. **Consistency**: Standardized validation across all apps

## Related Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Environment variable requirements for deployment
- [README.md](../README.md) - Getting started and development setup
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

## References

- GitHub Issue: Add CI step to catch missing environment variables early
- Error Example: `TypeError: Invalid URL` during Next.js prerendering
