// Core types for Phoenix Rooivalk system

// JSON-safe value type for serialization
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [k: string]: JSONValue }
  | JSONValue[];

export interface ThreatDetection {
  readonly id: string;
  readonly timestamp: string; // ISO 8601
  readonly location: {
    readonly latitude: number;
    readonly longitude: number;
    readonly altitude: number; // meters
  };
  readonly threatType: "drone" | "swarm" | "unknown";
  readonly confidence: number; // 0..1
  readonly sensorData: {
    readonly rf?: RFSignature;
    readonly acoustic?: AcousticSignature;
    readonly optical?: OpticalSignature;
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
  type: "kinetic" | "electronic" | "laser" | "net";
  status: "pending" | "active" | "completed" | "failed";
  effectiveness: number;
  cost: number;
}

export interface BlockchainAnchor {
  readonly transactionId: string;
  readonly chain: "solana" | "etherlink";
  readonly blockHeight: string; // use string to avoid 53-bit issues
  readonly timestamp: string; // ISO 8601
  readonly evidenceHash: string;
}

export interface EvidenceRecord {
  readonly id: string;
  readonly eventType: string;
  readonly payload: JSONValue;
  readonly digest: string;
  readonly timestamp: string; // ISO 8601
  readonly anchors: readonly BlockchainAnchor[];
}
