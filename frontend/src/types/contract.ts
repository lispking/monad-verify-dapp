// Contract-specific types that match the ABI exactly

export interface ContractAttNetworkRequest {
  url: string
  header: string
  method: string
  body: string
}

export interface ContractAttNetworkResponseResolve {
  keyName: string
  parseType: string
  parsePath: string
}

export interface ContractAttestor {
  attestorAddr: `0x${string}`
  url: string
}

export interface ContractAttestation {
  recipient: `0x${string}`
  request: ContractAttNetworkRequest
  reponseResolve: readonly ContractAttNetworkResponseResolve[]
  data: string
  attConditions: string
  timestamp: bigint
  additionParams: string
  attestors: readonly ContractAttestor[]
  signatures: readonly `0x${string}`[]
}

// Helper function to convert our Attestation to ContractAttestation
export function toContractAttestation(attestation: {
  recipient: `0x${string}`
  request: ContractAttNetworkRequest
  reponseResolve: ContractAttNetworkResponseResolve[]
  data: string
  attConditions: string
  timestamp: bigint
  additionParams: string
  attestors: ContractAttestor[]
  signatures: `0x${string}`[]
}): ContractAttestation {
  return {
    recipient: attestation.recipient,
    request: attestation.request,
    reponseResolve: attestation.reponseResolve as readonly ContractAttNetworkResponseResolve[],
    data: attestation.data,
    attConditions: attestation.attConditions,
    timestamp: attestation.timestamp,
    additionParams: attestation.additionParams,
    attestors: attestation.attestors as readonly ContractAttestor[],
    signatures: attestation.signatures as readonly `0x${string}`[],
  }
}
