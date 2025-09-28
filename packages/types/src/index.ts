// Core types for Phoenix Rooivalk system

export interface ThreatDetection {
  id: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  threatType: 'drone' | 'swarm' | 'unknown';
  confidence: number;
  sensorData: {
    rf?: RFSignature;
    acoustic?: AcousticSignature;
    optical?: OpticalSignature;
  };
}

export interface RFSignature {
  frequency: number;
  bandwidth: number;
  power: number;
  modulation?: string;
}

export interface AcousticSignature {
  frequency: number;
  amplitude: number;
  pattern: number[];
}

export interface OpticalSignature {
  size: number;
  shape: string;
  velocity: {
    x: number;
    y: number;
    z: number;
  };
}

export interface CountermeasureResponse {
  id: string;
  threatId: string;
  type: 'kinetic' | 'electronic' | 'laser' | 'net';
  status: 'pending' | 'active' | 'completed' | 'failed';
  effectiveness: number;
  cost: number;
}

export interface BlockchainAnchor {
  transactionId: string;
  chain: 'solana' | 'etherlink';
  blockHeight: number;
  timestamp: Date;
  evidenceHash: string;
}

export interface EvidenceRecord {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  digest: string;
  timestamp: Date;
  anchors: BlockchainAnchor[];
}
