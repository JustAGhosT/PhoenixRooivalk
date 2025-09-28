# Code Examples and Implementation Patterns

## Document Context

- **Location**: `10-appendices/technical-reference/code-examples.md`
- **Related Documents**:
  - [Smart Contracts](./smart-contracts.md) - Contract interfaces
  - [API Documentation](./api-documentation.md) - REST API reference
  - [System Integration](../../03-implementation/phase-4-system-integration/) -
    Integration guides

---

## Executive Summary

This document provides comprehensive code examples and implementation patterns
for integrating with the Phoenix Rooivalk blockchain-based counter-drone system.
These examples demonstrate best practices for evidence logging, API integration,
smart contract interaction, and real-time monitoring.

**Code Examples Include:**

- Python SDK implementation
- JavaScript/Node.js integration
- Smart contract interaction patterns
- WebSocket real-time monitoring
- Authentication and security implementations

---

## 1. Python Client Implementation

```python
# phoenix_client.py
import hashlib
import json
import requests
from typing import Dict, Any, Optional
from datetime import datetime

class PhoenixRooivalkClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.access_token = None
        self.session = requests.Session()

        self.session.headers.update({
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        })

    def authenticate(self, username: str = None, password: str = None) -> bool:
        auth_data = {
            'client_id': 'phoenix-python-client',
            'scope': 'read write'
        }

        if username and password:
            auth_data.update({'username': username, 'password': password})

        try:
            response = self.session.post(f"{self.base_url}/auth/token", json=auth_data)
            response.raise_for_status()

            token_data = response.json()
            self.access_token = token_data['access_token']

            self.session.headers.update({
                'Authorization': f"Bearer {self.access_token}"
            })

            return True
        except requests.RequestException as e:
            print(f"Authentication failed: {e}")
            return False

    def log_evidence(self, evidence_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        payload = {
            'evidence_type': evidence_type,
            'data': data,
            'metadata': {
                'source_system': 'python_client',
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'classification': 'unclassified'
            },
            'chain_to_previous': True
        }

        response = self.session.post(f"{self.base_url}/evidence/log", json=payload)
        response.raise_for_status()
        return response.json()

    def report_detection(self, sensor_id: str, target_type: str,
                        coordinates: Dict[str, float], threat_level: str,
                        confidence: float) -> Dict[str, Any]:
        payload = {
            'sensor_id': sensor_id,
            'detection_time': datetime.utcnow().isoformat() + 'Z',
            'target': {
                'type': target_type,
                'coordinates': coordinates,
                'characteristics': {'confidence': confidence}
            },
            'threat_assessment': {
                'level': threat_level,
                'reasoning': 'Automated detection',
                'recommended_action': 'monitor'
            }
        }

        response = self.session.post(f"{self.base_url}/detection/report", json=payload)
        response.raise_for_status()
        return response.json()

    def get_system_health(self) -> Dict[str, Any]:
        response = self.session.get(f"{self.base_url}/system/health")
        response.raise_for_status()
        return response.json()

# Example usage
client = PhoenixRooivalkClient(
    base_url="https://api.phoenixrooivalk.mil/v2",
    api_key="your-api-key-here"
)

# Authenticate and use
client.authenticate()

# Log detection evidence
evidence = client.log_evidence('drone_detection', {
    'sensor_id': 'RADAR_001',
    'target_type': 'quadcopter',
    'coordinates': {'lat': 34.0522, 'lon': -118.2437, 'alt': 150}
})

print(f"Evidence logged: {evidence['evidence_id']}")
```

---

## 2. JavaScript/Node.js Integration

```javascript
// phoenix-client.js
const axios = require("axios");
const WebSocket = require("ws");
const EventEmitter = require("events");

class PhoenixRooivalkClient extends EventEmitter {
  constructor(baseUrl, apiKey) {
    super();
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
    this.accessToken = null;

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  async authenticate(credentials = {}) {
    const authData = {
      client_id: "phoenix-node-client",
      scope: "read write",
      ...credentials,
    };

    try {
      const response = await this.api.post("/auth/token", authData);
      this.accessToken = response.data.access_token;
      this.emit("authenticated", response.data);
      return true;
    } catch (error) {
      this.emit("auth_error", error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async logEvidence(evidenceType, data, metadata = {}) {
    const payload = {
      evidence_type: evidenceType,
      data: data,
      metadata: {
        source_system: "node_client",
        timestamp: new Date().toISOString(),
        classification: "unclassified",
        ...metadata,
      },
      chain_to_previous: true,
    };

    try {
      const response = await this.api.post("/evidence/log", payload);
      this.emit("evidence_logged", response.data);
      return response.data;
    } catch (error) {
      this.emit("error", error);
      throw new Error(`Failed to log evidence: ${error.message}`);
    }
  }

  async reportDetection(
    sensorId,
    targetType,
    coordinates,
    threatLevel,
    confidence,
  ) {
    const payload = {
      sensor_id: sensorId,
      detection_time: new Date().toISOString(),
      target: {
        type: targetType,
        coordinates: coordinates,
        characteristics: { confidence: confidence },
      },
      threat_assessment: {
        level: threatLevel,
        reasoning: "Automated detection",
        recommended_action: "monitor",
      },
    };

    try {
      const response = await this.api.post("/detection/report", payload);
      this.emit("detection_reported", response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to report detection: ${error.message}`);
    }
  }

  startRealtimeMonitoring(wsUrl) {
    if (!this.accessToken) {
      throw new Error("Must authenticate before starting monitoring");
    }

    const wsProtocol = `bearer-token-${this.accessToken}`;
    this.ws = new WebSocket(wsUrl, [wsProtocol]);

    this.ws.on("open", () => this.emit("monitoring_started"));

    this.ws.on("message", (data) => {
      try {
        const event = JSON.parse(data);
        this.emit("realtime_event", event);
        this.emit(`event_${event.event_type}`, event);
      } catch (error) {
        this.emit("error", error);
      }
    });

    this.ws.on("error", (error) => this.emit("monitoring_error", error));
    this.ws.on("close", () => this.emit("monitoring_stopped"));

    return this.ws;
  }
}

module.exports = PhoenixRooivalkClient;

// Example usage
const client = new PhoenixRooivalkClient(
  "https://api.phoenixrooivalk.mil/v2",
  "your-api-key-here",
);

client.on("event_detection", (event) => {
  console.log(`Detection: ${event.detection_id} from ${event.sensor_id}`);
});

async function example() {
  await client.authenticate();

  const evidence = await client.logEvidence("drone_detection", {
    sensor_id: "RADAR_001",
    target_type: "quadcopter",
    coordinates: { lat: 34.0522, lon: -118.2437, alt: 150 },
  });

  client.startRealtimeMonitoring("wss://api.phoenixrooivalk.mil/v2/ws/events");
}

example();
```

---

## 3. Smart Contract Integration

```javascript
// smart-contract-client.js
const Web3 = require("web3");

class SmartContractClient {
  constructor(rpcUrl, privateKey, contractAddresses) {
    this.web3 = new Web3(rpcUrl);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);

    // Contract ABIs (simplified)
    const evidenceABI = [
      {
        inputs: [
          { name: "_evidenceHash", type: "bytes32" },
          { name: "_evidenceType", type: "string" },
          { name: "_metadata", type: "string" },
        ],
        name: "logEvidence",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
      },
      {
        inputs: [{ name: "_evidenceHash", type: "bytes32" }],
        name: "verifyEvidence",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
      },
    ];

    this.evidenceContract = new this.web3.eth.Contract(
      evidenceABI,
      contractAddresses.evidence,
    );
  }

  async logEvidence(evidenceHash, evidenceType, metadata) {
    try {
      const gasEstimate = await this.evidenceContract.methods
        .logEvidence(evidenceHash, evidenceType, metadata)
        .estimateGas({ from: this.account.address });

      const transaction = await this.evidenceContract.methods
        .logEvidence(evidenceHash, evidenceType, metadata)
        .send({
          from: this.account.address,
          gas: Math.floor(gasEstimate * 1.2),
        });

      return {
        transactionHash: transaction.transactionHash,
        blockNumber: transaction.blockNumber,
        gasUsed: transaction.gasUsed,
      };
    } catch (error) {
      throw new Error(`Failed to log evidence: ${error.message}`);
    }
  }

  async verifyEvidence(evidenceHash) {
    try {
      const isValid = await this.evidenceContract.methods
        .verifyEvidence(evidenceHash)
        .call();

      return { valid: isValid };
    } catch (error) {
      throw new Error(`Failed to verify evidence: ${error.message}`);
    }
  }
}

// Example usage
const contractClient = new SmartContractClient(
  "https://rpc.phoenixrooivalk.mil",
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  { evidence: "0x1234567890abcdef1234567890abcdef12345678" },
);

async function logDetection() {
  const detectionData = {
    sensor_id: "RADAR_001",
    target_type: "quadcopter",
    coordinates: { lat: 34.0522, lon: -118.2437, alt: 150 },
  };

  const evidenceHash = Web3.utils.keccak256(JSON.stringify(detectionData));
  const metadata = JSON.stringify({ source: "automated_detection" });

  const result = await contractClient.logEvidence(
    evidenceHash,
    "drone_detection",
    metadata,
  );

  console.log(`Evidence logged in transaction: ${result.transactionHash}`);
}

logDetection();
```

---

## 4. Integration Patterns

### 4.1 Error Handling Pattern

```python
# error_handling.py
import logging
from typing import Optional, Dict, Any
from functools import wraps

class PhoenixRooivalkError(Exception):
    def __init__(self, message: str, error_code: str = None, details: Dict = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)

def handle_api_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except requests.RequestException as e:
            if e.response is not None:
                error_data = e.response.json() if e.response.content else {}
                raise PhoenixRooivalkError(
                    error_data.get('message', str(e)),
                    error_data.get('error'),
                    error_data.get('details')
                )
            else:
                raise PhoenixRooivalkError(f"Network error: {str(e)}")
        except Exception as e:
            logging.error(f"Unexpected error in {func.__name__}: {str(e)}")
            raise PhoenixRooivalkError(f"Unexpected error: {str(e)}")

    return wrapper

class RobustPhoenixClient(PhoenixRooivalkClient):
    @handle_api_errors
    def log_evidence(self, evidence_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return super().log_evidence(evidence_type, data)

    @handle_api_errors
    def report_detection(self, *args, **kwargs) -> Dict[str, Any]:
        return super().report_detection(*args, **kwargs)
```

### 4.2 Retry and Circuit Breaker Pattern

```python
# resilience.py
import time
from typing import Callable, Any
from functools import wraps

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN

    def call(self, func: Callable, *args, **kwargs) -> Any:
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.timeout:
                self.state = 'HALF_OPEN'
            else:
                raise Exception("Circuit breaker is OPEN")

        try:
            result = func(*args, **kwargs)
            if self.state == 'HALF_OPEN':
                self.state = 'CLOSED'
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.failure_threshold:
                self.state = 'OPEN'

            raise e

def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            current_delay = delay

            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts >= max_attempts:
                        raise e

                    time.sleep(current_delay)
                    current_delay *= backoff

            return None
        return wrapper
    return decorator

# Usage example
circuit_breaker = CircuitBreaker()

class ResilientClient(PhoenixRooivalkClient):
    @retry(max_attempts=3, delay=1.0)
    def log_evidence_with_retry(self, evidence_type: str, data: Dict[str, Any]):
        return circuit_breaker.call(self.log_evidence, evidence_type, data)
```

---

## Conclusion

These code examples provide comprehensive integration patterns for the Phoenix
Rooivalk system, demonstrating best practices for API integration, smart
contract interaction, error handling, and resilience patterns.

**Key Implementation Features:**

- Complete Python and JavaScript client libraries
- Smart contract integration examples
- Real-time monitoring with WebSockets
- Robust error handling and retry mechanisms
- Circuit breaker patterns for resilience

---

**Related Documents:**

- [Smart Contracts](./smart-contracts.md) - Contract interfaces
- [API Documentation](./api-documentation.md) - REST API reference
- [System Integration](../../03-implementation/phase-4-system-integration/) -
  Integration guides

---

_Context improved by Giga AI - Used main overview development guidelines and
blockchain integration system information for accurate code examples._
