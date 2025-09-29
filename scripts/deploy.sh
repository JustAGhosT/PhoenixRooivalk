#!/bin/bash

# Phoenix Rooivalk Deployment Script
# Handles infrastructure and application deployment with proper directory management

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Ensure we're in the repository root
if [[ ! -f "Cargo.toml" ]]; then
    log_error "Must be run from repository root"
    exit 1
fi

deploy_infrastructure() {
    log_info "Deploying infrastructure..."
    
    # Use pushd/popd to manage directory changes properly
    pushd terraform >/dev/null
    
    # Initialize Terraform if needed
    if [[ ! -d ".terraform" ]]; then
        log_info "Initializing Terraform..."
        terraform init
    fi
    
    # Plan and apply infrastructure changes
    log_info "Planning infrastructure changes..."
    terraform plan -out=tfplan
    
    log_info "Applying infrastructure changes..."
    terraform apply tfplan
    
    # Clean up plan file
    rm -f tfplan
    
    log_success "Infrastructure deployed"
    
    # Return to original directory
    popd >/dev/null
}

deploy_application() {
    log_info "Deploying application..."
    
    # Use pushd/popd to manage directory changes properly
    pushd kubernetes >/dev/null
    
    # Apply Kubernetes manifests
    log_info "Applying Kubernetes manifests..."
    kubectl apply -f .
    
    # Wait for rollout to complete
    log_info "Waiting for deployment rollout..."
    kubectl rollout status deployment/phoenix-api
    kubectl rollout status deployment/phoenix-keeper
    
    log_success "Application deployed"
    
    # Return to original directory
    popd >/dev/null
}

deploy_monitoring() {
    log_info "Deploying monitoring stack..."
    
    pushd monitoring >/dev/null
    
    # Deploy monitoring components
    kubectl apply -f prometheus/
    kubectl apply -f grafana/
    kubectl apply -f alertmanager/
    
    log_success "Monitoring deployed"
    
    popd >/dev/null
}

# Main deployment function
main() {
    log_info "Starting Phoenix Rooivalk deployment..."
    
    # Check prerequisites
    command -v terraform >/dev/null 2>&1 || { log_error "terraform is required but not installed"; exit 1; }
    command -v kubectl >/dev/null 2>&1 || { log_error "kubectl is required but not installed"; exit 1; }
    
    # Deploy components in order
    case "${1:-all}" in
        "infrastructure"|"infra")
            deploy_infrastructure
            ;;
        "application"|"app")
            deploy_application
            ;;
        "monitoring"|"mon")
            deploy_monitoring
            ;;
        "all")
            deploy_infrastructure
            deploy_application
            deploy_monitoring
            ;;
        *)
            echo "Usage: $0 [infrastructure|application|monitoring|all]"
            echo "  infrastructure - Deploy Terraform infrastructure"
            echo "  application    - Deploy Kubernetes applications"
            echo "  monitoring     - Deploy monitoring stack"
            echo "  all           - Deploy everything (default)"
            exit 1
            ;;
    esac
    
    log_success "Deployment completed successfully!"
}

# Run main function with all arguments
main "$@"
