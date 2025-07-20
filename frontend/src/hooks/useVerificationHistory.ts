import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import { DataType } from '../types'
import { getMonadVerifyAddress } from '../config/contracts'
import { monadTestnet } from '../config/wagmi'

export interface VerificationRecord {
  id: string
  dataType: DataType
  status: 'pending' | 'verified' | 'failed'
  timestamp: Date
  requestId: string
  txHash?: string
  blockNumber?: number
}

// Cache structure for storing queried block ranges and events
interface BlockCache {
  lastQueriedBlock: number
  events: {
    requested: any[]
    completed: any[]
  }
}

const CACHE_KEY = 'monadverify_block_cache'
const BLOCK_RANGE = 500n
const RATE_LIMIT_DELAY = 1000 // 1 second delay between batches
const MAX_RETRIES = 3

export function useVerificationHistory() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [records, setRecords] = useState<VerificationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cache management functions
  const getCacheKey = useCallback((userAddress: string) => {
    return `${CACHE_KEY}_${userAddress.toLowerCase()}`
  }, [])

  const loadCache = useCallback((userAddress: string): BlockCache | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(userAddress))
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.warn('Failed to load block cache:', error)
      return null
    }
  }, [getCacheKey])

  const saveCache = useCallback((userAddress: string, cache: BlockCache) => {
    try {
      localStorage.setItem(getCacheKey(userAddress), JSON.stringify(cache))
    } catch (error) {
      console.warn('Failed to save block cache:', error)
    }
  }, [getCacheKey])

  // Rate-limited query function with retry mechanism
  const queryEventsWithRetry = useCallback(async (
    contractAddress: `0x${string}`,
    userAddress: `0x${string}`,
    fromBlock: bigint,
    toBlock: bigint,
    retryCount = 0
  ): Promise<{ requested: any[], completed: any[] }> => {
    try {
      // Get VerificationRequested events for this batch
      const requestedBatch = await publicClient!.getLogs({
        address: contractAddress,
        event: parseAbiItem('event VerificationRequested(address indexed user, bytes32 indexed requestId, string dataType, uint256 timestamp)'),
        args: {
          user: userAddress
        },
        fromBlock,
        toBlock
      })

      // Get VerificationCompleted events for this batch
      const completedBatch = await publicClient!.getLogs({
        address: contractAddress,
        event: parseAbiItem('event VerificationCompleted(address indexed user, bytes32 indexed requestId, bool success, uint256 timestamp)'),
        args: {
          user: userAddress
        },
        fromBlock,
        toBlock
      })

      return {
        requested: requestedBatch,
        completed: completedBatch
      }
    } catch (error: any) {
      // Check if it's a rate limit error
      if (error?.code === 429 && retryCount < MAX_RETRIES) {
        const delay = RATE_LIMIT_DELAY * Math.pow(2, retryCount) // Exponential backoff
        console.warn(`⏳ Rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`)

        await new Promise(resolve => setTimeout(resolve, delay))
        return queryEventsWithRetry(contractAddress, userAddress, fromBlock, toBlock, retryCount + 1)
      }

      // Re-throw if not rate limit or max retries exceeded
      throw error
    }
  }, [publicClient])

  // Sleep function for rate limiting
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // Load verification history from blockchain events with caching
  const loadHistory = useCallback(async () => {
    if (!address || !publicClient) {
      setRecords([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const contractAddress = getMonadVerifyAddress(monadTestnet.id)

      // Get current block number
      const currentBlock = await publicClient.getBlockNumber()
      const currentBlockNumber = Number(currentBlock)

      // Load existing cache
      const existingCache = loadCache(address)
      let allRequestedEvents: any[] = []
      let allCompletedEvents: any[] = []
      let startFromBlock = 0n

      if (existingCache && existingCache.lastQueriedBlock < currentBlockNumber) {
        // Use cached events and start from last queried block + 1
        allRequestedEvents = [...existingCache.events.requested]
        allCompletedEvents = [...existingCache.events.completed]
        startFromBlock = BigInt(existingCache.lastQueriedBlock + 1)

        console.log(`📦 Using cached events up to block ${existingCache.lastQueriedBlock}, querying from block ${startFromBlock}`)
      } else if (existingCache && existingCache.lastQueriedBlock >= currentBlockNumber) {
        // Cache is up to date, use cached data
        allRequestedEvents = existingCache.events.requested
        allCompletedEvents = existingCache.events.completed

        console.log(`✅ Cache is up to date (block ${existingCache.lastQueriedBlock}), using cached data`)
      } else {
        console.log(`🔍 No cache found, querying from genesis block`)
      }

      // Only query new blocks if needed
      if (startFromBlock <= currentBlock) {
        console.log(`🔄 Querying blocks ${startFromBlock} to ${currentBlock}`)

        // Batch requests in chunks of 500 blocks with rate limiting
        let batchCount = 0
        for (let fromBlock = startFromBlock; fromBlock <= currentBlock; fromBlock += BLOCK_RANGE) {
          const toBlock = fromBlock + BLOCK_RANGE - 1n > currentBlock ? currentBlock : fromBlock + BLOCK_RANGE - 1n

          try {
            // Add delay between batches to avoid rate limiting (except for first batch)
            if (batchCount > 0) {
              console.log(`⏳ Rate limiting: waiting ${RATE_LIMIT_DELAY}ms before next batch`)
              await sleep(RATE_LIMIT_DELAY)
            }

            // Query events with retry mechanism
            const batchResult = await queryEventsWithRetry(contractAddress, address, fromBlock, toBlock)

            allRequestedEvents.push(...batchResult.requested)
            allCompletedEvents.push(...batchResult.completed)

            console.log(`✅ Queried blocks ${fromBlock}-${toBlock}: ${batchResult.requested.length} requested, ${batchResult.completed.length} completed`)
            batchCount++
          } catch (batchError: any) {
            console.warn(`❌ Failed to fetch events for blocks ${fromBlock}-${toBlock}:`, batchError)

            // If it's a rate limit error, add extra delay before continuing
            if (batchError?.code === 429) {
              console.log(`⏳ Rate limit exceeded, adding extra delay before continuing`)
              await sleep(RATE_LIMIT_DELAY * 2)
            }
            // Continue with next batch even if one fails
          }
        }

        // Update cache with new data
        const newCache: BlockCache = {
          lastQueriedBlock: currentBlockNumber,
          events: {
            requested: allRequestedEvents,
            completed: allCompletedEvents
          }
        }
        saveCache(address, newCache)

        console.log(`💾 Cache updated: ${allRequestedEvents.length} requested events, ${allCompletedEvents.length} completed events`)
      }

      const requestedEvents = allRequestedEvents
      const completedEvents = allCompletedEvents

      // Create a map of completed verifications
      const completedMap = new Map<string, { success: boolean; timestamp: bigint; blockNumber: bigint; txHash: string }>()
      completedEvents.forEach(event => {
        if (event.args.requestId && event.args.success !== undefined && event.args.timestamp !== undefined) {
          completedMap.set(event.args.requestId, {
            success: event.args.success,
            timestamp: event.args.timestamp,
            blockNumber: event.blockNumber,
            txHash: event.transactionHash
          })
        }
      })

      // Combine the events to create verification records
      const verificationRecords: VerificationRecord[] = requestedEvents
        .filter(event => event.args.requestId) // Filter out events without requestId
        .map(event => {
          const requestId = event.args.requestId!
          const completed = completedMap.get(requestId)

          return {
            id: requestId,
            dataType: event.args.dataType as DataType,
            status: completed ? (completed.success ? 'verified' : 'failed') : 'pending',
            timestamp: new Date(Number(event.args.timestamp) * 1000),
            requestId: requestId,
            txHash: event.transactionHash,
            blockNumber: Number(event.blockNumber)
          }
        })

      // Sort by timestamp (newest first)
      verificationRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      setRecords(verificationRecords)
    } catch (err) {
      console.error('Failed to load verification history from blockchain:', err)
      setError(err instanceof Error ? err.message : 'Failed to load verification history')
      setRecords([])
    } finally {
      setIsLoading(false)
    }
  }, [address, publicClient])

  // Get records by status
  const getRecordsByStatus = useCallback((status: VerificationRecord['status']) => {
    return records.filter(record => record.status === status)
  }, [records])

  // Get records by data type
  const getRecordsByDataType = useCallback((dataType: DataType) => {
    return records.filter(record => record.dataType === dataType)
  }, [records])

  // Get statistics
  const getStats = useCallback(() => {
    const total = records.length
    const verified = records.filter(r => r.status === 'verified').length
    const pending = records.filter(r => r.status === 'pending').length
    const failed = records.filter(r => r.status === 'failed').length

    const dataTypes = new Set(records.map(r => r.dataType))
    const uniqueDataTypes = dataTypes.size

    const lastVerification = records.length > 0
      ? records.reduce((latest, record) =>
          record.timestamp > latest.timestamp ? record : latest
        )
      : null

    return {
      total,
      verified,
      pending,
      failed,
      uniqueDataTypes,
      lastVerification,
      successRate: total > 0 ? (verified / total) * 100 : 0
    }
  }, [records])

  // Clear cache for current user
  const clearCache = useCallback(() => {
    if (address) {
      localStorage.removeItem(getCacheKey(address))
      console.log('🗑️ Cache cleared for current user')
    }
  }, [address, getCacheKey])

  // Force refresh (clear cache and reload)
  const forceRefresh = useCallback(async () => {
    clearCache()
    await loadHistory()
  }, [clearCache, loadHistory])

  // Load history when address changes
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return {
    records,
    isLoading,
    error,
    getRecordsByStatus,
    getRecordsByDataType,
    getStats,
    refresh: loadHistory,
    clearCache,
    forceRefresh
  }
}
