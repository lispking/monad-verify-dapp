// Primus zkTLS Types
// Based on @primuslabs/zktls-contracts/src/IPrimusZKTLS.sol

import { env } from '../config/env'

export interface AttNetworkRequest {
  url: string
  header: string
  method: string
  body: string
}

export interface AttNetworkResponseResolve {
  keyName: string
  parseType: string
  parsePath: string
}

export interface Attestor {
  attestorAddr: `0x${string}`
  url: string
}

export interface Attestation {
  recipient: `0x${string}`
  request: AttNetworkRequest
  reponseResolve: AttNetworkResponseResolve[]
  data: string
  attConditions: string
  timestamp: bigint
  additionParams: string
  attestors: Attestor[]
  signatures: `0x${string}`[]
}

// Helper function to create a mock attestation for testing
export function createMockAttestation(
  recipient: string,
  data: string,
  dataType: string = 'identity'
): Attestation {
  return {
    recipient: recipient as `0x${string}`,
    request: {
      url: `${env.MOCK_API_URL}/api/verify`,
      header: '{"Content-Type": "application/json"}',
      method: 'POST',
      body: `{"type": "${dataType}", "data": "${data}"}`,
    },
    reponseResolve: [
      {
        keyName: 'verified',
        parseType: 'JSON',
        parsePath: '$.verified',
      },
    ],
    data,
    attConditions: `{"dataType": "${dataType}"}`,
    timestamp: BigInt(Math.floor(Date.now() / 1000)),
    additionParams: '',
    attestors: [
      {
        attestorAddr: '0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431' as `0x${string}`, // Real Primus Verifier address
        url: `${env.MOCK_API_URL}/api/health`,
      },
    ],
    signatures: [('0x' + '0'.repeat(130)) as `0x${string}`], // Mock signature
  }
}

// Helper function to validate attestation structure
export function validateAttestation(attestation: Attestation): boolean {
  return (
    attestation.recipient.length > 0 &&
    attestation.data !== '' &&
    attestation.timestamp > 0n &&
    attestation.attestors.length > 0 &&
    attestation.signatures.length > 0
  )
}
