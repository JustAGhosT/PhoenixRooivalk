# System Maintenance Guide

## Document Context
- **Location**: `09-operations/maintenance-guide.md`
- **Related Documents**:
  - [Standard Procedures](./standard-procedures.md) - Daily operations
  - [Incident Response](./incident-response.md) - Emergency procedures
  - [Training Materials](./training-materials.md) - Maintenance training
  - [Deployment Guide](../08-deployment/deployment-guide.md) - System deployment

---

## Executive Summary

This document provides comprehensive maintenance procedures for the Phoenix Rooivalk blockchain-based counter-drone system. Our maintenance framework ensures optimal system performance, security compliance, and operational reliability through proactive maintenance, automated monitoring, and systematic upgrade procedures.

**Key Maintenance Areas:**
- Preventive maintenance schedules and procedures
- System health monitoring and optimization
- Security updates and patch management
- Performance tuning and capacity planning
- Backup and recovery validation

---

## 1. Maintenance Schedule Framework

### 1.1 Maintenance Windows

```yaml
maintenance_windows:
  daily:
    time: "02:00-04:00_UTC"
    duration: "2_hours"
    impact: "minimal"
    activities:
      - log_rotation
      - temporary_file_cleanup
      - cache_optimization
      - health_checks
  
  weekly:
    time: "Sunday_02:00-06:00_UTC"
    duration: "4_hours"
    impact: "low"
    activities:
      - security_updates
      - performance_optimization
      - backup_validation
      - certificate_renewal
  
  monthly:
    time: "First_Sunday_02:00-08:00_UTC"
    duration: "6_hours"
    impact: "moderate"
    activities:
      - major_updates
      - capacity_planning
      - disaster_recovery_testing
      - security_audits
  
  quarterly:
    time: "Scheduled_maintenance_weekend"
    duration: "12_hours"
    impact: "significant"
    activities:
      - major_version_upgrades
      - infrastructure_updates
      - comprehensive_testing
      - documentation_updates
```

### 1.2 Maintenance Classification

```yaml
maintenance_types:
  preventive:
    description: "Scheduled maintenance to prevent issues"
    frequency: "regular_intervals"
    approval_required: false
    examples:
      - "routine_updates"
      - "performance_optimization"
      - "security_patches"
  
  corrective:
    description: "Maintenance to fix identified issues"
    frequency: "as_needed"
    approval_required: true
    examples:
      - "bug_fixes"
      - "configuration_corrections"
      - "performance_issues"
  
  adaptive:
    description: "Maintenance to adapt to changing requirements"
    frequency: "planned"
    approval_required: true
    examples:
      - "feature_updates"
      - "compliance_changes"
      - "capacity_increases"
  
  perfective:
    description: "Maintenance to improve system performance"
    frequency: "planned"
    approval_required: true
    examples:
      - "optimization_improvements"
      - "user_experience_enhancements"
      - "efficiency_upgrades"
```

---

## 2. Preventive Maintenance Procedures

### 2.1 Daily Maintenance Tasks

```bash
#!/bin/bash
# daily-maintenance.sh - Automated daily maintenance tasks

set -euo pipefail

echo "=== Daily Maintenance Tasks - $(date) ==="

# Log rotation and cleanup
echo "Performing log rotation..."
kubectl exec -n phoenix-rooivalk $(kubectl get pods -n phoenix-rooivalk -l app=blockchain-node -o jsonpath='{.items[0].metadata.name}') -- logrotate /etc/logrotate.conf

# Temporary file cleanup
echo "Cleaning temporary files..."
kubectl exec -n phoenix-rooivalk $(kubectl get pods -n phoenix-rooivalk -l app=blockchain-node -o jsonpath='{.items[0].metadata.name}') -- find /tmp -type f -mtime +1 -delete

# Cache optimization
echo "Optimizing caches..."
kubectl exec -n phoenix-rooivalk redis-0 -- redis-cli FLUSHEXPIRED

# Database maintenance
echo "Performing database maintenance..."
kubectl exec -n phoenix-rooivalk postgres-0 -- psql -U postgres -d phoenixrooivalk -c "VACUUM ANALYZE;"

# Certificate validation
echo "Validating certificates..."
kubectl get secrets -n phoenix-rooivalk -o json | jq -r '.items[] | select(.type=="kubernetes.io/tls") | .metadata.name' | while read secret; do
    expiry=$(kubectl get secret "$secret" -n phoenix-rooivalk -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -noout -enddate | cut -d= -f2)
    echo "Certificate $secret expires: $expiry"
done

# Health checks
echo "Performing health checks..."
./health-check.sh

echo "=== Daily Maintenance Complete ==="
```

### 2.2 Weekly Maintenance Tasks

```python
# weekly-maintenance.py
import asyncio
import subprocess
import json
from datetime import datetime, timedelta
from typing import Dict, List

class WeeklyMaintenanceManager:
    """
    Automated weekly maintenance task manager
    """
    
    def __init__(self):
        self.maintenance_tasks = self.load_maintenance_tasks()
        self.completion_status = {}
    
    def load_maintenance_tasks(self) -> Dict[str, Dict]:
        """Load weekly maintenance task definitions"""
        return {
            "security_updates": {
                "description": "Apply security patches and updates",
                "priority": "high",
                "estimated_duration": "60_minutes",
                "dependencies": [],
                "rollback_required": True
            },
            
            "performance_optimization": {
                "description": "Optimize system performance",
                "priority": "medium",
                "estimated_duration": "45_minutes",
                "dependencies": ["security_updates"],
                "rollback_required": False
            },
            
            "backup_validation": {
                "description": "Validate backup integrity and recovery procedures",
                "priority": "high",
                "estimated_duration": "30_minutes",
                "dependencies": [],
                "rollback_required": False
            },
            
            "certificate_management": {
                "description": "Renew expiring certificates",
                "priority": "high",
                "estimated_duration": "20_minutes",
                "dependencies": [],
                "rollback_required": True
            },
            
            "capacity_analysis": {
                "description": "Analyze system capacity and resource usage",
                "priority": "medium",
                "estimated_duration": "30_minutes",
                "dependencies": ["performance_optimization"],
                "rollback_required": False
            }
        }
    
    async def execute_weekly_maintenance(self):
        """Execute weekly maintenance tasks"""
        
        print(f"=== Weekly Maintenance - {datetime.now().strftime('%Y-%m-%d')} ===")
        
        # Execute tasks in dependency order
        task_order = self.resolve_dependencies()
        
        for task_name in task_order:
            task_config = self.maintenance_tasks[task_name]
            
            print(f"Executing task: {task_name}")
            print(f"Description: {task_config['description']}")
            print(f"Estimated duration: {task_config['estimated_duration']}")
            
            try:
                await self.execute_task(task_name, task_config)
                self.completion_status[task_name] = "completed"
                print(f"✓ Task {task_name} completed successfully")
            except Exception as e:
                self.completion_status[task_name] = f"failed: {str(e)}"
                print(f"✗ Task {task_name} failed: {str(e)}")
                
                if task_config.get("rollback_required", False):
                    await self.rollback_task(task_name)
        
        # Generate maintenance report
        await self.generate_maintenance_report()
    
    async def execute_task(self, task_name: str, task_config: Dict):
        """Execute specific maintenance task"""
        
        task_handlers = {
            "security_updates": self.apply_security_updates,
            "performance_optimization": self.optimize_performance,
            "backup_validation": self.validate_backups,
            "certificate_management": self.manage_certificates,
            "capacity_analysis": self.analyze_capacity
        }
        
        handler = task_handlers.get(task_name)
        if handler:
            await handler()
        else:
            raise ValueError(f"Unknown task: {task_name}")
    
    async def apply_security_updates(self):
        """Apply security updates to system components"""
        
        # Update container images
        deployments = [
            "blockchain-node",
            "api-gateway",
            "monitoring-stack"
        ]
        
        for deployment in deployments:
            # Check for image updates
            result = subprocess.run([
                "kubectl", "get", "deployment", deployment, 
                "-n", "phoenix-rooivalk", 
                "-o", "jsonpath={.spec.template.spec.containers[0].image}"
            ], capture_output=True, text=True)
            
            current_image = result.stdout.strip()
            print(f"Current image for {deployment}: {current_image}")
            
            # Update to latest security patch
            await self.update_deployment_image(deployment, current_image)
    
    async def optimize_performance(self):
        """Optimize system performance"""
        
        # Database optimization
        await self.optimize_database()
        
        # Cache optimization
        await self.optimize_caches()
        
        # Resource optimization
        await self.optimize_resources()
    
    async def validate_backups(self):
        """Validate backup integrity and recovery procedures"""
        
        # List recent backups
        backup_validation = {
            "database_backups": await self.validate_database_backups(),
            "blockchain_backups": await self.validate_blockchain_backups(),
            "configuration_backups": await self.validate_config_backups()
        }
        
        # Test restore procedures
        await self.test_restore_procedures()
        
        return backup_validation
    
    async def manage_certificates(self):
        """Manage SSL/TLS certificates"""
        
        # Check certificate expiration
        expiring_certs = await self.check_certificate_expiration()
        
        # Renew certificates expiring within 30 days
        for cert in expiring_certs:
            if cert["days_until_expiry"] < 30:
                await self.renew_certificate(cert["name"])
    
    def resolve_dependencies(self) -> List[str]:
        """Resolve task dependencies and return execution order"""
        
        # Simple topological sort for task dependencies
        visited = set()
        temp_visited = set()
        result = []
        
        def visit(task_name: str):
            if task_name in temp_visited:
                raise ValueError(f"Circular dependency detected involving {task_name}")
            if task_name in visited:
                return
            
            temp_visited.add(task_name)
            
            for dependency in self.maintenance_tasks[task_name].get("dependencies", []):
                visit(dependency)
            
            temp_visited.remove(task_name)
            visited.add(task_name)
            result.append(task_name)
        
        for task_name in self.maintenance_tasks:
            if task_name not in visited:
                visit(task_name)
        
        return result
```

### 2.3 Monthly Maintenance Tasks

```yaml
monthly_maintenance_checklist:
  infrastructure_review:
    - review_resource_utilization
    - analyze_performance_trends
    - update_capacity_planning
    - review_cost_optimization
  
  security_assessment:
    - vulnerability_scanning
    - penetration_testing_coordination
    - security_policy_review
    - compliance_audit
  
  disaster_recovery_testing:
    - backup_restore_testing
    - failover_procedure_validation
    - recovery_time_verification
    - documentation_updates
  
  system_optimization:
    - database_performance_tuning
    - network_optimization
    - storage_optimization
    - application_performance_review
  
  documentation_maintenance:
    - procedure_updates
    - configuration_documentation
    - architecture_diagram_updates
    - training_material_updates
```

---

## 3. System Health Monitoring

### 3.1 Health Check Framework

```bash
#!/bin/bash
# comprehensive-health-check.sh

set -euo pipefail

HEALTH_REPORT="/tmp/health-report-$(date +%Y%m%d-%H%M%S).json"

echo "=== Comprehensive System Health Check ==="

# Initialize health report
cat > "$HEALTH_REPORT" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "checks": {}
}
EOF

# Kubernetes cluster health
echo "Checking Kubernetes cluster health..."
kubectl get nodes --no-headers | while read node status roles age version; do
  if [[ "$status" != "Ready" ]]; then
    jq --arg node "$node" --arg status "$status" '.checks.kubernetes.nodes += [{"node": $node, "status": $status, "healthy": false}]' "$HEALTH_REPORT" > tmp && mv tmp "$HEALTH_REPORT"
  fi
done

# Blockchain network health
echo "Checking blockchain network health..."
BLOCKCHAIN_NODES=$(kubectl get pods -n phoenix-rooivalk -l app=blockchain-node --no-headers | wc -l)
READY_NODES=$(kubectl get pods -n phoenix-rooivalk -l app=blockchain-node --field-selector=status.phase=Running --no-headers | wc -l)

jq --argjson total "$BLOCKCHAIN_NODES" --argjson ready "$READY_NODES" '.checks.blockchain = {"total_nodes": $total, "ready_nodes": $ready, "healthy": ($ready >= ($total * 0.67))}' "$HEALTH_REPORT" > tmp && mv tmp "$HEALTH_REPORT"

# Database health
echo "Checking database health..."
DB_STATUS=$(kubectl exec -n phoenix-rooivalk postgres-0 -- pg_isready -U postgres)
if [[ "$DB_STATUS" == *"accepting connections"* ]]; then
  jq '.checks.database = {"status": "healthy", "accepting_connections": true}' "$HEALTH_REPORT" > tmp && mv tmp "$HEALTH_REPORT"
else
  jq '.checks.database = {"status": "unhealthy", "accepting_connections": false}' "$HEALTH_REPORT" > tmp && mv tmp "$HEALTH_REPORT"
fi

# Storage health
echo "Checking storage health..."
kubectl get pv | grep -v "Available\|Bound" | while read pv capacity access reclaim status claim storageclass reason age; do
  if [[ "$status" != "Bound" && "$status" != "Available" ]]; then
    jq --arg pv "$pv" --arg status "$status" '.checks.storage.issues += [{"pv": $pv, "status": $status}]' "$HEALTH_REPORT" > tmp && mv tmp "$HEALTH_REPORT"
  fi
done

# Network connectivity
echo "Checking network connectivity..."
kubectl run network-test --rm -i --restart=Never --image=busybox:latest -- nslookup kubernetes.default.svc.cluster.local > /dev/null 2>&1
if [ $? -eq 0 ]; then
  jq '.checks.network = {"dns_resolution": true, "healthy": true}' "$HEALTH_REPORT" > tmp && mv tmp "$HEALTH_REPORT"
else
  jq '.checks.network = {"dns_resolution": false, "healthy": false}' "$HEALTH_REPORT" > tmp && mv tmp "$HEALTH_REPORT"
fi

# Generate summary
echo "Generating health summary..."
OVERALL_HEALTH=$(jq -r '[.checks[] | select(type == "object") | .healthy] | all' "$HEALTH_REPORT")
jq --argjson overall "$OVERALL_HEALTH" '.summary = {"overall_healthy": $overall, "timestamp": .timestamp}' "$HEALTH_REPORT" > tmp && mv tmp "$HEALTH_REPORT"

echo "Health check complete. Report saved to: $HEALTH_REPORT"
cat "$HEALTH_REPORT" | jq '.'
```

### 3.2 Performance Monitoring

```python
# performance-monitoring.py
import asyncio
import json
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class PerformanceMonitor:
    """
    System performance monitoring and optimization
    """
    
    def __init__(self):
        self.metrics_collectors = self.initialize_collectors()
        self.performance_thresholds = self.load_thresholds()
    
    def load_thresholds(self) -> Dict[str, Dict]:
        """Load performance thresholds"""
        return {
            "cpu_utilization": {"warning": 70, "critical": 85},
            "memory_utilization": {"warning": 80, "critical": 90},
            "disk_utilization": {"warning": 85, "critical": 95},
            "network_latency": {"warning": 100, "critical": 200},
            "transaction_throughput": {"warning": 800, "critical": 500},
            "response_time": {"warning": 2000, "critical": 5000}
        }
    
    async def collect_performance_metrics(self) -> Dict[str, float]:
        """Collect current performance metrics"""
        
        metrics = {}
        
        # CPU utilization
        cpu_result = subprocess.run([
            "kubectl", "top", "nodes", "--no-headers"
        ], capture_output=True, text=True)
        
        cpu_usage = []
        for line in cpu_result.stdout.strip().split('\n'):
            if line:
                parts = line.split()
                cpu_percent = int(parts[1].replace('%', ''))
                cpu_usage.append(cpu_percent)
        
        metrics["cpu_utilization"] = sum(cpu_usage) / len(cpu_usage) if cpu_usage else 0
        
        # Memory utilization
        memory_result = subprocess.run([
            "kubectl", "top", "nodes", "--no-headers"
        ], capture_output=True, text=True)
        
        memory_usage = []
        for line in memory_result.stdout.strip().split('\n'):
            if line:
                parts = line.split()
                memory_percent = int(parts[3].replace('%', ''))
                memory_usage.append(memory_percent)
        
        metrics["memory_utilization"] = sum(memory_usage) / len(memory_usage) if memory_usage else 0
        
        # Transaction throughput
        metrics["transaction_throughput"] = await self.measure_transaction_throughput()
        
        # Response time
        metrics["response_time"] = await self.measure_response_time()
        
        return metrics
    
    async def measure_transaction_throughput(self) -> float:
        """Measure blockchain transaction throughput"""
        
        # Get transaction count over last minute
        result = subprocess.run([
            "kubectl", "exec", "-n", "phoenix-rooivalk", "blockchain-node-0", "--",
            "curl", "-s", "http://localhost:9090/metrics"
        ], capture_output=True, text=True)
        
        # Parse metrics for transaction count
        for line in result.stdout.split('\n'):
            if 'transaction_count' in line and 'rate' in line:
                return float(line.split()[-1])
        
        return 0.0
    
    async def analyze_performance_trends(self) -> Dict[str, str]:
        """Analyze performance trends and provide recommendations"""
        
        current_metrics = await self.collect_performance_metrics()
        recommendations = {}
        
        for metric_name, value in current_metrics.items():
            thresholds = self.performance_thresholds.get(metric_name, {})
            
            if value > thresholds.get("critical", 100):
                recommendations[metric_name] = f"CRITICAL: {metric_name} at {value}% - immediate action required"
            elif value > thresholds.get("warning", 80):
                recommendations[metric_name] = f"WARNING: {metric_name} at {value}% - monitor closely"
            else:
                recommendations[metric_name] = f"OK: {metric_name} at {value}% - within normal range"
        
        return recommendations
```

---

## 4. Backup and Recovery Maintenance

### 4.1 Backup Validation Procedures

```bash
#!/bin/bash
# backup-validation.sh

set -euo pipefail

BACKUP_DATE="${1:-$(date +%Y-%m-%d)}"
VALIDATION_REPORT="/tmp/backup-validation-$BACKUP_DATE.json"

echo "=== Backup Validation for $BACKUP_DATE ==="

# Initialize validation report
cat > "$VALIDATION_REPORT" << EOF
{
  "validation_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "backup_date": "$BACKUP_DATE",
  "validations": {}
}
EOF

# Validate database backups
echo "Validating database backups..."
DB_BACKUP_PATH="s3://phoenix-rooivalk-backups/database/$BACKUP_DATE/"
aws s3 ls "$DB_BACKUP_PATH" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  # Download and test backup
  aws s3 cp "${DB_BACKUP_PATH}database-backup.sql.gz" /tmp/
  gunzip -t /tmp/database-backup.sql.gz
  if [ $? -eq 0 ]; then
    jq '.validations.database = {"exists": true, "integrity": true, "size": "'$(stat -c%s /tmp/database-backup.sql.gz)'"}' "$VALIDATION_REPORT" > tmp && mv tmp "$VALIDATION_REPORT"
  else
    jq '.validations.database = {"exists": true, "integrity": false, "error": "corruption detected"}' "$VALIDATION_REPORT" > tmp && mv tmp "$VALIDATION_REPORT"
  fi
else
  jq '.validations.database = {"exists": false, "error": "backup not found"}' "$VALIDATION_REPORT" > tmp && mv tmp "$VALIDATION_REPORT"
fi

# Validate blockchain backups
echo "Validating blockchain backups..."
BLOCKCHAIN_BACKUP_PATH="s3://phoenix-rooivalk-backups/blockchain/$BACKUP_DATE/"
aws s3 ls "$BLOCKCHAIN_BACKUP_PATH" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  BACKUP_SIZE=$(aws s3 ls "$BLOCKCHAIN_BACKUP_PATH" --recursive --summarize | grep "Total Size" | awk '{print $3}')
  jq --arg size "$BACKUP_SIZE" '.validations.blockchain = {"exists": true, "size": $size}' "$VALIDATION_REPORT" > tmp && mv tmp "$VALIDATION_REPORT"
else
  jq '.validations.blockchain = {"exists": false, "error": "backup not found"}' "$VALIDATION_REPORT" > tmp && mv tmp "$VALIDATION_REPORT"
fi

# Test restore procedure
echo "Testing restore procedure..."
./test-restore-procedure.sh "$BACKUP_DATE" > /tmp/restore-test.log 2>&1
if [ $? -eq 0 ]; then
  jq '.validations.restore_test = {"success": true, "log": "/tmp/restore-test.log"}' "$VALIDATION_REPORT" > tmp && mv tmp "$VALIDATION_REPORT"
else
  jq '.validations.restore_test = {"success": false, "error": "restore test failed", "log": "/tmp/restore-test.log"}' "$VALIDATION_REPORT" > tmp && mv tmp "$VALIDATION_REPORT"
fi

echo "Backup validation complete. Report: $VALIDATION_REPORT"
cat "$VALIDATION_REPORT" | jq '.'
```

---

## 5. Capacity Planning and Optimization

### 5.1 Capacity Analysis Framework

```yaml
capacity_planning:
  monitoring_metrics:
    compute_resources:
      - cpu_utilization_trend
      - memory_usage_trend
      - storage_growth_rate
      - network_bandwidth_usage
    
    application_metrics:
      - transaction_volume_growth
      - user_activity_trends
      - data_storage_requirements
      - processing_time_trends
    
    infrastructure_metrics:
      - node_capacity_utilization
      - storage_capacity_trends
      - network_capacity_usage
      - backup_storage_growth
  
  forecasting_models:
    linear_growth:
      description: "Simple linear projection"
      use_case: "steady_growth_patterns"
      accuracy: "moderate"
    
    seasonal_analysis:
      description: "Seasonal pattern analysis"
      use_case: "cyclical_usage_patterns"
      accuracy: "high"
    
    machine_learning:
      description: "ML-based forecasting"
      use_case: "complex_patterns"
      accuracy: "very_high"
  
  scaling_thresholds:
    cpu_utilization: 70
    memory_utilization: 75
    storage_utilization: 80
    network_utilization: 60
```

---

## Conclusion

The comprehensive maintenance guide ensures optimal system performance, security, and reliability through systematic preventive maintenance, proactive monitoring, and continuous optimization. Regular adherence to these maintenance procedures maintains operational excellence while supporting mission-critical counter-drone capabilities.

**Key Maintenance Principles:**
- Proactive maintenance prevents issues before they impact operations
- Systematic health monitoring enables early issue detection
- Regular performance optimization maintains system efficiency
- Comprehensive backup validation ensures recovery capabilities
- Continuous capacity planning supports growth requirements

---

**Related Documents:**
- [Standard Procedures](./standard-procedures.md) - Daily operations
- [Incident Response](./incident-response.md) - Emergency procedures
- [Training Materials](./training-materials.md) - Maintenance training

---

*Context improved by Giga AI - Used main overview development guidelines and blockchain integration system information for accurate maintenance procedures.*
