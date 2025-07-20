import { monadTestnet, monadMainnet } from '../config/wagmi'

export interface AddNetworkParams {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: readonly string[]
  blockExplorerUrls?: string[]
}

export async function addNetworkToWallet(chainId: number): Promise<boolean> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('MetaMask is not installed')
  }

  const ethereum = (window as any).ethereum

  let networkParams: AddNetworkParams

  switch (chainId) {
    case monadTestnet.id:
      networkParams = {
        chainId: `0x${monadTestnet.id.toString(16)}`, // Convert to hex
        chainName: monadTestnet.name,
        nativeCurrency: monadTestnet.nativeCurrency,
        rpcUrls: monadTestnet.rpcUrls.default.http,
        blockExplorerUrls: [monadTestnet.blockExplorers.default.url],
      }
      break
    case monadMainnet.id:
      networkParams = {
        chainId: `0x${monadMainnet.id.toString(16)}`, // Convert to hex
        chainName: monadMainnet.name,
        nativeCurrency: monadMainnet.nativeCurrency,
        rpcUrls: monadMainnet.rpcUrls.default.http,
        blockExplorerUrls: [monadMainnet.blockExplorers.default.url],
      }
      break
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  try {
    console.log('Adding network to wallet:', networkParams)
    
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    })
    
    console.log('Network added successfully')
    return true
  } catch (error: any) {
    console.error('Failed to add network:', error)
    
    if (error.code === 4001) {
      throw new Error('User rejected the request to add network')
    } else if (error.code === -32602) {
      throw new Error('Invalid network parameters')
    } else {
      throw new Error(`Failed to add network: ${error.message}`)
    }
  }
}

export async function switchToNetwork(chainId: number): Promise<boolean> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('MetaMask is not installed')
  }

  const ethereum = (window as any).ethereum

  try {
    console.log('Switching to network:', chainId)
    
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
    
    console.log('Network switched successfully')
    return true
  } catch (error: any) {
    console.error('Failed to switch network:', error)
    
    if (error.code === 4902) {
      // Network not added, try to add it first
      console.log('Network not found, attempting to add...')
      await addNetworkToWallet(chainId)
      
      // Try switching again after adding
      return switchToNetwork(chainId)
    } else if (error.code === 4001) {
      throw new Error('User rejected the request to switch network')
    } else {
      throw new Error(`Failed to switch network: ${error.message}`)
    }
  }
}


