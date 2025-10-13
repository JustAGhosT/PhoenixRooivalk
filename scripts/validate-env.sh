#!/bin/bash
# Environment variable validation script for CI
# This script validates that required environment variables are set and valid
# to catch errors early before build/deployment

# Note: Don't use 'set -e' because we want to collect all errors before exiting

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track validation status
ERRORS=0
WARNINGS=0

log_error() {
    echo -e "${RED}ERROR: $1${NC}"
    ((ERRORS++))
}

log_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
    ((WARNINGS++))
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_info() {
    echo "ℹ $1"
}

# Validate URL format
validate_url() {
    local var_name=$1
    local url_value=$2
    local required=$3
    
    # Check if variable is set (even if empty)
    if [ -z "${!var_name+x}" ]; then
        # Variable is not set at all
        if [ "$required" = "true" ]; then
            log_error "$var_name is required but not set"
            return 1
        else
            log_info "$var_name not set (optional)"
            return 0
        fi
    fi
    
    # Variable is set, check if it's empty
    if [ -z "$url_value" ]; then
        log_error "$var_name is set but empty (this will cause 'Invalid URL' errors)"
        return 1
    fi
    
    # Check if it's a valid URL format
    if [[ ! "$url_value" =~ ^https?:// ]]; then
        log_error "$var_name='$url_value' is not a valid URL (must start with http:// or https://)"
        return 1
    fi
    
    # Check if URL is just the protocol (empty URL)
    if [[ "$url_value" =~ ^https?://$ ]]; then
        log_error "$var_name='$url_value' is invalid (URL is incomplete)"
        return 1
    fi
    
    log_success "$var_name is set and valid: $url_value"
    return 0
}

# Validate database URL
validate_db_url() {
    local var_name=$1
    local db_value=$2
    local required=$3
    
    if [ -z "$db_value" ]; then
        if [ "$required" = "true" ]; then
            log_error "$var_name is required but not set"
            return 1
        else
            log_info "$var_name not set (optional)"
            return 0
        fi
    fi
    
    # Check if it's a valid database URL format
    if [[ ! "$db_value" =~ ^(sqlite|postgresql|postgres):// ]]; then
        log_error "$var_name='$db_value' is not a valid database URL (must start with sqlite://, postgresql:// or postgres://)"
        return 1
    fi
    
    log_success "$var_name is set and valid"
    return 0
}

# Main validation function
validate_env() {
    local app=$1
    
    echo ""
    echo "=========================================="
    echo "Validating environment for: $app"
    echo "=========================================="
    echo ""
    
    case $app in
        docs)
            # Docs app environment variables (from docusaurus.config.ts)
            log_info "Checking docs app environment variables..."
            
            # Optional: ENV_NAME, DEPLOY_CONTEXT, CONTEXT (defaults to 'local')
            log_info "ENV_NAME: ${ENV_NAME:-local} (optional, defaults to 'local')"
            log_info "DEPLOY_CONTEXT: ${DEPLOY_CONTEXT:-} (optional)"
            log_info "CONTEXT: ${CONTEXT:-} (optional)"
            
            # Optional: BRANCH, GITHUB_HEAD_REF, GITHUB_REF_NAME
            log_info "BRANCH: ${BRANCH:-} (optional)"
            log_info "GITHUB_HEAD_REF: ${GITHUB_HEAD_REF:-} (optional)"
            log_info "GITHUB_REF_NAME: ${GITHUB_REF_NAME:-} (optional)"
            
            # MARKETING_URL is optional but must be valid if set
            validate_url "MARKETING_URL" "${MARKETING_URL}" "false" || true
            ;;
            
        marketing)
            # Marketing app environment variables
            log_info "Checking marketing app environment variables..."
            
            # NODE_ENV (typically set by Next.js)
            log_info "NODE_ENV: ${NODE_ENV:-development} (optional, defaults to 'development')"
            
            # Next.js public environment variables (all optional)
            if [ -n "${NEXT_PUBLIC_PLAUSIBLE_DOMAIN:-}" ]; then
                log_success "NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set: ${NEXT_PUBLIC_PLAUSIBLE_DOMAIN}"
            else
                log_info "NEXT_PUBLIC_PLAUSIBLE_DOMAIN not set (optional, analytics disabled)"
            fi
            
            if [ -n "${NEXT_PUBLIC_GA_MEASUREMENT_ID:-}" ]; then
                log_success "NEXT_PUBLIC_GA_MEASUREMENT_ID is set"
            else
                log_info "NEXT_PUBLIC_GA_MEASUREMENT_ID not set (optional, analytics disabled)"
            fi
            ;;
            
        api)
            # API app environment variables (from connection.rs)
            log_info "Checking API app environment variables..."
            
            # Database URL is required (API_DB_URL or DATABASE_URL)
            if [ -n "${API_DB_URL:-}" ]; then
                validate_db_url "API_DB_URL" "${API_DB_URL}" "true" || true
            elif [ -n "${DATABASE_URL:-}" ]; then
                validate_db_url "DATABASE_URL" "${DATABASE_URL}" "true" || true
            else
                log_error "Neither API_DB_URL nor DATABASE_URL is set (one is required)"
            fi
            
            # Optional: PORT, RUST_LOG
            log_info "PORT: ${PORT:-8080} (optional, defaults to 8080)"
            log_info "RUST_LOG: ${RUST_LOG:-info} (optional, defaults to 'info')"
            ;;
            
        keeper)
            # Keeper app environment variables (from config.rs)
            log_info "Checking keeper app environment variables..."
            
            # Database URL is required
            if [ -n "${KEEPER_DB_URL:-}" ]; then
                validate_db_url "KEEPER_DB_URL" "${KEEPER_DB_URL}" "true" || true
            elif [ -n "${DATABASE_URL:-}" ]; then
                validate_db_url "DATABASE_URL" "${DATABASE_URL}" "true" || true
            else
                log_error "Neither KEEPER_DB_URL nor DATABASE_URL is set (one is required)"
            fi
            
            # Provider configuration (optional, defaults to stub)
            log_info "KEEPER_PROVIDER: ${KEEPER_PROVIDER:-stub} (optional, defaults to 'stub')"
            
            if [ "${KEEPER_PROVIDER:-}" = "etherlink" ]; then
                validate_url "ETHERLINK_ENDPOINT" "${ETHERLINK_ENDPOINT}" "false" || true
                log_info "ETHERLINK_NETWORK: ${ETHERLINK_NETWORK:-ghostnet}"
                log_info "ETHERLINK_PRIVATE_KEY: ${ETHERLINK_PRIVATE_KEY:+***set***}"
            elif [ "${KEEPER_PROVIDER:-}" = "solana" ]; then
                validate_url "SOLANA_ENDPOINT" "${SOLANA_ENDPOINT}" "false" || true
                log_info "SOLANA_NETWORK: ${SOLANA_NETWORK:-devnet}"
            elif [ "${KEEPER_PROVIDER:-}" = "multi" ]; then
                if [ -n "${ETHERLINK_ENDPOINT:-}" ]; then
                    validate_url "ETHERLINK_ENDPOINT" "${ETHERLINK_ENDPOINT}" "false" || true
                    log_info "ETHERLINK_NETWORK: ${ETHERLINK_NETWORK:-ghostnet}"
                fi
                if [ -n "${SOLANA_ENDPOINT:-}" ]; then
                    validate_url "SOLANA_ENDPOINT" "${SOLANA_ENDPOINT}" "false" || true
                    log_info "SOLANA_NETWORK: ${SOLANA_NETWORK:-devnet}"
                fi
            fi
            ;;
            
        *)
            log_error "Unknown app: $app"
            log_info "Valid apps: docs, marketing, api, keeper"
            exit 1
            ;;
    esac
    
    echo ""
    echo "=========================================="
    echo "Validation Summary for $app"
    echo "=========================================="
    echo "Errors: $ERRORS"
    echo "Warnings: $WARNINGS"
    echo ""
    
    if [ $ERRORS -gt 0 ]; then
        log_error "Environment validation failed with $ERRORS error(s)"
        echo ""
        echo "Please ensure all required environment variables are set correctly."
        echo "See DEPLOYMENT.md for more information on required environment variables."
        return 1
    else
        log_success "Environment validation passed"
        if [ $WARNINGS -gt 0 ]; then
            log_warning "$WARNINGS warning(s) found"
        fi
        return 0
    fi
}

# Usage help
show_usage() {
    echo "Usage: $0 <app>"
    echo ""
    echo "Validate environment variables for a specific app"
    echo ""
    echo "Arguments:"
    echo "  app        The app to validate (docs, marketing, api, keeper)"
    echo ""
    echo "Examples:"
    echo "  $0 docs"
    echo "  $0 marketing"
    echo "  $0 api"
    echo "  $0 keeper"
    echo ""
    exit 1
}

# Main script execution
if [ $# -eq 0 ]; then
    show_usage
fi

APP=$1
validate_env "$APP"
exit $?
