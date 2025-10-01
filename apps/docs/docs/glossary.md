# Glossary

> Concise, public-safe definitions of terms and acronyms used in PhoenixRooivalk
> documentation.

<!-- Mini Table of Contents -->

- [Operations and concepts](#operations-and-concepts)
- [Messaging and observability](#messaging-and-observability)
- [Communications and EW](#communications-and-ew)
- [Navigation and PNT](#navigation-and-pnt)
- [System components](#system-components)
- [Neutralization and countermeasures](#neutralization-and-countermeasures)

## Operations and concepts

- **BLOS (Beyond Line of Sight)**: Operations where direct visual or RF line of
  sight between controller and aircraft is not maintained; typically relies on
  relays or autonomous control.
- **C2 (Command and Control)**: Interfaces and services used to task, monitor,
  and coordinate system components and effectors.
- **Counter‑UAS / C‑UAS**: Systems designed to detect, identify, track, and
  neutralize unauthorized or hostile drones.
- **DEW (Directed Energy Weapon)**: Non‑kinetic effectors that use focused
  energy (e.g., lasers) to disrupt or disable targets.
- **Edge Computing**: Processing data at or near the sensor/source to reduce
  latency and reliance on backhaul connectivity.
- **EW (Electronic Warfare)**: Military use of the electromagnetic spectrum to
  sense, protect, and attack. Includes jamming and deception.
- **Fiber Control (Tethered/Spool)**: Jam‑resistant command link over optical
  fiber, avoiding RF denial environments.
- **ISR (Intelligence, Surveillance, Reconnaissance)**: Sensing and data fusion
  activities to build situational awareness.
- **Swarm**: Coordinated operation of multiple drones to achieve emergent
  effects (e.g., distributed sensing or denial). See
  [Future Enhancements](./technical_overview.md#future-enhancements).
- **VTOL (Vertical Take‑Off and Landing)**: Aircraft capable of vertical
  take‑off, hover, and landing without a runway.
- **Kill Chain (Detect‑Identify‑Decide‑Act)**: Operational sequence guiding
  engagement actions; details vary by mission and policy.
- **Geofencing**: Virtual boundaries enforced by navigation logic to restrict or
  alert on movement into no‑go areas.
- **Remote ID / Blue‑Force ID**: Broadcast identification and status for
  compliant or friendly drones to aid deconfliction.

[Back to top](#glossary)

## Messaging and observability

- **gRPC**: High‑performance, HTTP/2‑based RPC framework used for control plane
  APIs. See
  [Architecture: Data plane & messaging](./architecture/overview.md#data-plane--messaging).
- **Kafka**: Distributed event streaming platform for high‑throughput message
  processing. See
  [Architecture: Data plane & messaging](./architecture/overview.md#data-plane--messaging).
- **NATS**: Lightweight messaging system for low‑latency pub/sub and request‑
  reply patterns. See
  [Architecture: Data plane & messaging](./architecture/overview.md#data-plane--messaging).
- **OpenTelemetry (OTel)**: Open standard for telemetry collection and export
  (traces, metrics, logs) used for observability. See
  [Architecture: Data plane & messaging](./architecture/overview.md#data-plane--messaging).
- **QoS (Quality of Service)**: Prioritization and guarantees for data
  transport, especially for flight control vs. payload data.
- **WORM Storage (Write Once, Read Many)**: Immutable storage used for
  evidence/forensics retention. See
  [Architecture: Data plane & messaging](./architecture/overview.md#data-plane--messaging).

[Back to top](#glossary)

## Documentation conventions

- **Importance Score**: A relative 0–100 heuristic indicating how critical a
  component is to mission outcomes and system integrity. Unless otherwise
  specified, scores are derived using the following weighting:

  - Operational impact (40%): effect on safety, mission continuity, compliance
  - Security exposure (25%): likelihood and consequence of exploitation
  - Architectural centrality (20%): dependency hub, failure blast radius
  - Change volatility (15%): rate of change, defect likelihood, maintainability

  Typical interpretation:

  - 80–100: Mission-critical. Requires strict reviews, tests, and hardening.
  - 60–79: High importance. Prioritize for monitoring and regression tests.
  - &lt;60: Moderate/low. Standard engineering controls apply.

  Note: Scores are comparative within this repository; they are not universal.
  When absent, assume default importance per domain owner guidance.

[Back to top](#glossary)

## Communications and EW

- **LOS (Line of Sight)**: Unobstructed direct path between transmitter and
  receiver (visual or RF).
- **RF (Radio Frequency)**: Part of the EM spectrum used for wireless links.
- **RF Jamming**: Intentional transmission to degrade or deny RF communications
  between a drone and its controller. See
  [Core Technologies](./technical_overview.md#core-technologies).
- **Beamforming**: Steering transmit/receive energy in specific directions to
  improve link margin and reduce interference.
- **FHSS (Frequency‑Hopping Spread Spectrum)**: Rapidly changing frequencies to
  improve interference/jam resistance and LPI/LPD characteristics.
- **DSSS (Direct‑Sequence Spread Spectrum)**: Spreads a signal over wider
  bandwidth using a chipping code to improve resilience and reduce
  detectability.
- **LPI/LPD (Low Probability of Intercept/Detection)**: Signaling and operating
  practices that minimize detectability by adversaries.
- **Spectrum Management / EW Deconfliction**: Allocation and prioritization of
  frequencies and power to minimize mutual interference across systems. See
  [Core Technologies](./technical_overview.md#core-technologies).
- **DF/TDOA (Direction Finding / Time Difference of Arrival)**: Methods to
  estimate emitter bearing/location using multi‑sensor timing/angle
  measurements.
- **Link Budget**: Power balance calculation for a radio link including transmit
  power, path loss, antenna gain, and receiver sensitivity. See
  [Core Technologies](./technical_overview.md#core-technologies).

[Back to top](#glossary)

## Navigation and PNT

- **GPS Spoofing**: Technique to mislead a receiver’s position/timing by
  injecting forged satellite signals. See
  [Core Technologies](./technical_overview.md#core-technologies).
- **Anti‑Spoofing**: Techniques to detect and reject falsified GNSS signals
  (e.g., consistency checks, multi‑constellation, signal quality tests).
- **INS Aiding (IMU/GNSS Fusion)**: Blending inertial sensors with GNSS to
  maintain navigation during outages or spoof attempts.
- **PNT (Positioning, Navigation, Timing)**: Core navigation services enabling
  location, course, and time synchronization.
- **RAIM (Receiver Autonomous Integrity Monitoring)**: GNSS integrity checks to
  detect faulty satellites/signals using redundant measurements.

[Back to top](#glossary)

## System components

- **RKV‑C2**: PhoenixRooivalk C2 and data plane component coordinating all
  modules with strict QoS and observability. See
  [System components](./technical_overview.md#system-components-and-combined-approach).
- **RKV‑G**: Ground rover providing mobile GCS, mast, logistics, and fiber link
  support. See
  [System components](./technical_overview.md#system-components-and-combined-approach).
- **RKV‑I**: Deployable minis (interceptor, decoy, ISR) with RF or optional
  fiber control. See
  [System components](./technical_overview.md#system-components-and-combined-approach).
- **RKV‑M**: VTOL mothership acting as picket, relay, and mini‑launcher with
  land‑relaunch capability. See
  [System components](./technical_overview.md#system-components-and-combined-approach).
- **Multi‑Sensor Fusion**: Combining RF, radar, optical, acoustic and other
  sensors to improve detection, classification, and spoof resilience. See
  [System Architecture](./technical_overview.md#system-architecture).

[Back to top](#glossary)

## Neutralization and Countermeasures

- **Hard Kill / Soft Kill**: Physical destruction/disablement vs. non‑kinetic
  defeat (e.g., jamming, spoofing, nets).
- **Spectrum Management / EW Deconfliction**: Allocation and prioritization of
  frequencies and power to minimize mutual interference across systems. See
  [Neutralization Module](./technical_overview.md) and
  [Core Technologies](./technical_overview.md#core-technologies).
- **Swarm Disruption**: Tactics and tools to degrade coordinated multi‑drone
  behavior (e.g., comms denial, leader isolation, decoying). See
  [Future Enhancements](./technical_overview.md#future-enhancements).
- **Link Budget**: Power balance calculation for a radio link including transmit
  power, path loss, antenna gain, and receiver sensitivity. See
  [Core Technologies](./technical_overview.md#core-technologies).
- **Kill Chain (Detect‑Identify‑Decide‑Act)**: Operational sequence guiding
  engagement actions; details vary by mission and policy.

See also: `docs/technical_overview.md`, `docs/architecture/overview.md`, and
`docs/competitor_analysis.md` for additional context and market comparisons.

[Back to top](#glossary)
