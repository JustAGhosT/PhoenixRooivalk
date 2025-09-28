# API Documentation

## Document Context
- **Location**: `10-appendices/technical-reference/api-documentation.md`
- **Related Documents**:
  - [Smart Contracts](./smart-contracts.md) - Contract interfaces
  - [Code Examples](./code-examples.md) - Implementation examples
  - [API Specifications](../../03-implementation/phase-4-system-integration/api-specifications.md) - Integration specs

---

## Executive Summary

This document provides comprehensive API documentation for the Phoenix Rooivalk blockchain-based counter-drone system. Our REST API architecture enables secure, scalable integration with external systems while maintaining complete audit trails and operational transparency.

**API Capabilities:**
- Evidence logging and retrieval
- Real-time system monitoring
- Threat detection and response
- Access control and authentication
- Operational state management

**Base URL**: `https://api.phoenixrooivalk.mil/v2`  
**Authentication**: Bearer Token (JWT) + mTLS  
**Rate Limiting**: 1000 requests/minute per API key

---

## 1. Authentication & Authorization

### 1.1 Authentication Methods

```yaml
authentication:
  primary:
    method: "Bearer Token (JWT)"
    header: "Authorization: Bearer <token>"
    expiry: "24_hours"
    refresh: "supported"
  
  secondary:
    method: "mTLS Client Certificates"
    validation: "certificate_chain"
    revocation: "OCSP_checking"
  
  api_keys:
    method: "X-API-Key header"
    usage: "service_to_service"
    rotation: "quarterly"
```

### 1.2 Token Endpoint

**POST** `/auth/token`

Obtain JWT access token for API authentication.

```json
{
  "method": "POST",
  "endpoint": "/auth/token",
  "description": "Authenticate and obtain access token",
  "request_body": {
    "username": "string",
    "password": "string",
    "client_id": "string",
    "scope": "string"
  },
  "responses": {
    "200": {
      "description": "Authentication successful",
      "body": {
        "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
        "token_type": "Bearer",
        "expires_in": 86400,
        "refresh_token": "def50200...",
        "scope": "read write admin"
      }
    },
    "401": {
      "description": "Authentication failed",
      "body": {
        "error": "invalid_credentials",
        "error_description": "Invalid username or password"
      }
    }
  }
}
```

**Example Request:**
```bash
curl -X POST https://api.phoenixrooivalk.mil/v2/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "operator@phoenixrooivalk.mil",
    "password": "secure_password",
    "client_id": "phoenix-client",
    "scope": "read write"
  }'
```

---

## 2. Evidence Management API

### 2.1 Log Evidence

**POST** `/evidence/log`

Submit evidence to blockchain for immutable logging.

```json
{
  "method": "POST",
  "endpoint": "/evidence/log",
  "description": "Log evidence with blockchain anchoring",
  "headers": {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
  },
  "request_body": {
    "evidence_type": "string",
    "data": "object",
    "metadata": {
      "source_system": "string",
      "timestamp": "ISO8601",
      "classification": "string",
      "tags": ["string"]
    },
    "chain_to_previous": "boolean"
  },
  "responses": {
    "201": {
      "description": "Evidence logged successfully",
      "body": {
        "evidence_id": "uuid",
        "evidence_hash": "sha256_hash",
        "blockchain_tx": "transaction_hash",
        "timestamp": "ISO8601",
        "chain_position": "integer"
      }
    },
    "400": {
      "description": "Invalid request data",
      "body": {
        "error": "validation_error",
        "details": ["field_errors"]
      }
    }
  }
}
```

**Example Request:**
```bash
curl -X POST https://api.phoenixrooivalk.mil/v2/evidence/log \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "evidence_type": "drone_detection",
    "data": {
      "sensor_id": "RADAR_001",
      "target_type": "quadcopter",
      "coordinates": {
        "lat": 34.0522,
        "lon": -118.2437,
        "alt": 150
      },
      "threat_level": "medium",
      "confidence": 0.87
    },
    "metadata": {
      "source_system": "detection_engine",
      "timestamp": "2024-01-15T14:30:00Z",
      "classification": "unclassified",
      "tags": ["automated", "radar"]
    },
    "chain_to_previous": true
  }'
```

### 2.2 Retrieve Evidence

**GET** `/evidence/{evidence_id}`

Retrieve evidence record by ID with blockchain verification.

```json
{
  "method": "GET",
  "endpoint": "/evidence/{evidence_id}",
  "description": "Retrieve evidence record with verification",
  "path_parameters": {
    "evidence_id": "UUID of evidence record"
  },
  "query_parameters": {
    "verify_chain": "boolean (default: true)",
    "include_metadata": "boolean (default: true)"
  },
  "responses": {
    "200": {
      "description": "Evidence retrieved successfully",
      "body": {
        "evidence_id": "uuid",
        "evidence_hash": "sha256_hash",
        "evidence_type": "string",
        "data": "object",
        "metadata": "object",
        "blockchain": {
          "transaction_hash": "string",
          "block_number": "integer",
          "timestamp": "ISO8601",
          "verified": "boolean"
        },
        "chain_info": {
          "previous_hash": "sha256_hash",
          "next_hash": "sha256_hash",
          "position": "integer"
        }
      }
    },
    "404": {
      "description": "Evidence not found",
      "body": {
        "error": "not_found",
        "message": "Evidence record not found"
      }
    }
  }
}
```

### 2.3 Search Evidence

**GET** `/evidence/search`

Search evidence records with filtering and pagination.

```json
{
  "method": "GET",
  "endpoint": "/evidence/search",
  "description": "Search evidence records with filters",
  "query_parameters": {
    "evidence_type": "string",
    "source_system": "string",
    "start_date": "ISO8601",
    "end_date": "ISO8601",
    "tags": "comma_separated_strings",
    "classification": "string",
    "page": "integer (default: 1)",
    "limit": "integer (default: 50, max: 1000)"
  },
  "responses": {
    "200": {
      "description": "Search results",
      "body": {
        "results": [
          {
            "evidence_id": "uuid",
            "evidence_type": "string",
            "timestamp": "ISO8601",
            "source_system": "string",
            "summary": "string"
          }
        ],
        "pagination": {
          "page": "integer",
          "limit": "integer",
          "total": "integer",
          "pages": "integer"
        }
      }
    }
  }
}
```

---

## 3. Detection & Response API

### 3.1 Report Detection

**POST** `/detection/report`

Report drone detection event with automatic evidence logging.

```json
{
  "method": "POST",
  "endpoint": "/detection/report",
  "description": "Report drone detection event",
  "request_body": {
    "sensor_id": "string",
    "detection_time": "ISO8601",
    "target": {
      "type": "string",
      "coordinates": {
        "lat": "number",
        "lon": "number",
        "alt": "number"
      },
      "velocity": {
        "speed": "number",
        "heading": "number"
      },
      "characteristics": {
        "size": "string",
        "signature": "string",
        "confidence": "number"
      }
    },
    "threat_assessment": {
      "level": "string",
      "reasoning": "string",
      "recommended_action": "string"
    }
  },
  "responses": {
    "201": {
      "description": "Detection reported successfully",
      "body": {
        "detection_id": "uuid",
        "evidence_id": "uuid",
        "status": "string",
        "recommended_actions": ["string"],
        "escalation_required": "boolean"
      }
    }
  }
}
```

### 3.2 Execute Response

**POST** `/response/execute`

Execute response action against detected threat.

```json
{
  "method": "POST",
  "endpoint": "/response/execute",
  "description": "Execute response action",
  "request_body": {
    "detection_id": "uuid",
    "action_type": "string",
    "effector_id": "string",
    "parameters": {
      "target_coordinates": {
        "lat": "number",
        "lon": "number",
        "alt": "number"
      },
      "engagement_mode": "string",
      "duration": "integer",
      "power_level": "number"
    },
    "authorization": {
      "operator_id": "string",
      "approval_code": "string"
    }
  },
  "responses": {
    "202": {
      "description": "Response action initiated",
      "body": {
        "action_id": "uuid",
        "status": "initiated",
        "estimated_completion": "ISO8601",
        "monitoring_url": "/response/status/{action_id}"
      }
    }
  }
}
```

### 3.3 Response Status

**GET** `/response/status/{action_id}`

Monitor response action execution status.

```json
{
  "method": "GET",
  "endpoint": "/response/status/{action_id}",
  "description": "Get response action status",
  "responses": {
    "200": {
      "description": "Response status",
      "body": {
        "action_id": "uuid",
        "status": "string",
        "progress": "number",
        "start_time": "ISO8601",
        "completion_time": "ISO8601",
        "outcome": {
          "success": "boolean",
          "effectiveness": "number",
          "target_neutralized": "boolean",
          "collateral_damage": "boolean"
        },
        "evidence_logged": "boolean"
      }
    }
  }
}
```

---

## 4. System Monitoring API

### 4.1 System Health

**GET** `/system/health`

Get comprehensive system health status.

```json
{
  "method": "GET",
  "endpoint": "/system/health",
  "description": "Get system health status",
  "responses": {
    "200": {
      "description": "System health information",
      "body": {
        "overall_status": "string",
        "timestamp": "ISO8601",
        "components": {
          "blockchain": {
            "status": "operational",
            "consensus": "active",
            "node_count": 5,
            "sync_status": "synchronized"
          },
          "detection_systems": {
            "status": "operational",
            "active_sensors": 12,
            "coverage_percentage": 95.7
          },
          "response_systems": {
            "status": "operational",
            "available_effectors": 8,
            "ready_percentage": 100.0
          },
          "api_gateway": {
            "status": "operational",
            "response_time_ms": 45,
            "requests_per_minute": 150
          }
        },
        "alerts": [
          {
            "level": "warning",
            "component": "sensor_003",
            "message": "Sensor offline for maintenance",
            "timestamp": "ISO8601"
          }
        ]
      }
    }
  }
}
```

### 4.2 Performance Metrics

**GET** `/system/metrics`

Get system performance metrics and statistics.

```json
{
  "method": "GET",
  "endpoint": "/system/metrics",
  "description": "Get performance metrics",
  "query_parameters": {
    "timeframe": "string (1h, 6h, 24h, 7d)",
    "metrics": "comma_separated_metric_names"
  },
  "responses": {
    "200": {
      "description": "Performance metrics",
      "body": {
        "timeframe": "string",
        "timestamp": "ISO8601",
        "metrics": {
          "detection_rate": {
            "current": 15.3,
            "average": 12.7,
            "peak": 28.1,
            "unit": "detections_per_hour"
          },
          "response_time": {
            "current": 2.3,
            "average": 2.8,
            "p95": 4.1,
            "unit": "seconds"
          },
          "system_availability": {
            "current": 99.97,
            "target": 99.95,
            "unit": "percentage"
          },
          "blockchain_tps": {
            "current": 1250,
            "average": 980,
            "peak": 2100,
            "unit": "transactions_per_second"
          }
        }
      }
    }
  }
}
```

---

## 5. Configuration Management API

### 5.1 Get Configuration

**GET** `/config/{component}`

Retrieve configuration for system component.

```json
{
  "method": "GET",
  "endpoint": "/config/{component}",
  "description": "Get component configuration",
  "path_parameters": {
    "component": "Component name (sensors, effectors, detection, response)"
  },
  "responses": {
    "200": {
      "description": "Configuration retrieved",
      "body": {
        "component": "string",
        "version": "string",
        "last_updated": "ISO8601",
        "configuration": {
          "detection_thresholds": {
            "confidence_minimum": 0.7,
            "size_filter": "small_to_large",
            "speed_threshold": 50
          },
          "response_parameters": {
            "engagement_timeout": 30,
            "power_levels": [25, 50, 75, 100],
            "safety_zones": ["coordinates"]
          }
        }
      }
    }
  }
}
```

### 5.2 Update Configuration

**PUT** `/config/{component}`

Update component configuration with validation.

```json
{
  "method": "PUT",
  "endpoint": "/config/{component}",
  "description": "Update component configuration",
  "request_body": {
    "configuration": "object",
    "validation_required": "boolean",
    "backup_current": "boolean",
    "effective_time": "ISO8601"
  },
  "responses": {
    "200": {
      "description": "Configuration updated successfully",
      "body": {
        "component": "string",
        "version": "string",
        "changes_applied": "integer",
        "validation_results": {
          "valid": "boolean",
          "warnings": ["string"],
          "errors": ["string"]
        },
        "rollback_available": "boolean"
      }
    }
  }
}
```

---

## 6. WebSocket API

### 6.1 Real-time Events

**WebSocket** `/ws/events`

Real-time event streaming for monitoring and alerts.

```yaml
websocket_events:
  connection:
    url: "wss://api.phoenixrooivalk.mil/v2/ws/events"
    authentication: "Bearer token in Sec-WebSocket-Protocol header"
    
  event_types:
    detection:
      description: "New drone detection events"
      payload:
        event_type: "detection"
        detection_id: "uuid"
        sensor_id: "string"
        timestamp: "ISO8601"
        target_info: "object"
        
    response:
      description: "Response action events"
      payload:
        event_type: "response"
        action_id: "uuid"
        status: "string"
        timestamp: "ISO8601"
        
    alert:
      description: "System alerts and warnings"
      payload:
        event_type: "alert"
        level: "string"
        component: "string"
        message: "string"
        timestamp: "ISO8601"
        
    system_status:
      description: "System status changes"
      payload:
        event_type: "system_status"
        component: "string"
        old_status: "string"
        new_status: "string"
        timestamp: "ISO8601"
```

**Example WebSocket Client:**
```javascript
const ws = new WebSocket('wss://api.phoenixrooivalk.mil/v2/ws/events', ['bearer-token-' + accessToken]);

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    switch(data.event_type) {
        case 'detection':
            handleDetectionEvent(data);
            break;
        case 'response':
            handleResponseEvent(data);
            break;
        case 'alert':
            handleAlertEvent(data);
            break;
        case 'system_status':
            handleStatusEvent(data);
            break;
    }
};
```

---

## 7. Error Handling

### 7.1 Standard Error Responses

```json
{
  "error_format": {
    "error": "error_code",
    "message": "Human readable error message",
    "details": "Additional error details or validation errors",
    "timestamp": "ISO8601",
    "request_id": "uuid",
    "documentation_url": "https://docs.phoenixrooivalk.mil/errors/{error_code}"
  }
}
```

### 7.2 HTTP Status Codes

```yaml
status_codes:
  200: "OK - Request successful"
  201: "Created - Resource created successfully"
  202: "Accepted - Request accepted for processing"
  400: "Bad Request - Invalid request data"
  401: "Unauthorized - Authentication required"
  403: "Forbidden - Insufficient permissions"
  404: "Not Found - Resource not found"
  409: "Conflict - Resource conflict"
  422: "Unprocessable Entity - Validation errors"
  429: "Too Many Requests - Rate limit exceeded"
  500: "Internal Server Error - Server error"
  502: "Bad Gateway - Upstream service error"
  503: "Service Unavailable - Service temporarily unavailable"
```

---

## 8. Rate Limiting & Quotas

### 8.1 Rate Limits

```yaml
rate_limits:
  authentication:
    endpoint: "/auth/token"
    limit: "5 requests per minute per IP"
    
  evidence_logging:
    endpoint: "/evidence/log"
    limit: "100 requests per minute per API key"
    
  detection_reporting:
    endpoint: "/detection/report"
    limit: "1000 requests per minute per API key"
    
  general_api:
    limit: "1000 requests per minute per API key"
    burst: "50 requests per second"
    
  websocket:
    connections: "10 concurrent connections per API key"
```

### 8.2 Rate Limit Headers

```yaml
response_headers:
  X-RateLimit-Limit: "Request limit per window"
  X-RateLimit-Remaining: "Remaining requests in current window"
  X-RateLimit-Reset: "Unix timestamp when limit resets"
  X-RateLimit-Retry-After: "Seconds to wait before retrying (when limited)"
```

---

## Conclusion

The Phoenix Rooivalk API provides comprehensive, secure access to all system capabilities while maintaining performance, security, and auditability requirements. The RESTful design with WebSocket support enables both synchronous operations and real-time monitoring integration.

**API Key Features:**
- Comprehensive authentication and authorization
- Complete evidence management with blockchain integration
- Real-time detection and response capabilities
- System monitoring and configuration management
- WebSocket support for real-time events
- Robust error handling and rate limiting

---

**Related Documents:**
- [Smart Contracts](./smart-contracts.md) - Contract interfaces
- [Code Examples](./code-examples.md) - Implementation examples
- [API Specifications](../../03-implementation/phase-4-system-integration/api-specifications.md) - Integration specs

---

*Context improved by Giga AI - Used main overview development guidelines and blockchain integration system information for accurate API documentation.*
