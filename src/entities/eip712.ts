import { CELLAR_ADDRESS, STOP_LIMIT_ORDER_ADDRESS } from '../constants'
import { cellarTypes, name, types } from '../types'

import { ChainId } from '../enums'
import { SigningKey } from '@ethersproject/signing-key'
import { Web3Provider } from '@ethersproject/providers'
import { getMessage } from 'eip-712'
import { splitSignature } from '@ethersproject/bytes'

export interface Domain {
  name: string
  chainId: ChainId
  verifyingContract: string
}

export interface Message {
  maker: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  recipient: string
  startTime: string
  endTime: string
  stopPrice: string
  oracleAddress: string
  oracleData: string
}

export interface CellarApprovalMessage {
  warning: string
  user: string
  masterContract: string
  approved: boolean
  nonce: number
}

export const getSignature = (message: Message, chainId: ChainId, privateKey: string) => {
  let domain: Domain = {
    name: name,
    chainId: chainId,
    verifyingContract: STOP_LIMIT_ORDER_ADDRESS[chainId]
  }
  return sign({ types, primaryType: 'LimitOrder', domain, message }, privateKey)
}

export const getTypedData = (message: Message, chainId: ChainId) => {
  let domain: Domain = {
    name: name,
    chainId: chainId,
    verifyingContract: STOP_LIMIT_ORDER_ADDRESS[chainId]
  }
  return { types, primaryType: 'LimitOrder', domain, message }
}

export const getTypedDataCellar = (message: CellarApprovalMessage, chainId: ChainId) => {
  let domain: Domain = {
    name: 'Cellar V1',
    chainId: chainId,
    verifyingContract: CELLAR_ADDRESS[chainId]
  }
  return {
    types: cellarTypes,
    primaryType: 'SetMasterContractApproval',
    domain,
    message
  }
}

export const getTypeHash = (typedData: any) => {
  let message = getMessage(typedData, true).toString('hex')
  return `0x${message}`
}

const sign = (typedData: any, privateKey: string) => {
  let message = getMessage(typedData, true)
  const signingKey = new SigningKey(privateKey)
  const { v, r, s } = signingKey.signDigest(message)
  return { v, r, s }
}

export const getSignatureWithProvider = async (
  message: Message,
  chainId: ChainId,
  provider: Web3Provider
): Promise<{ v: number; r: string; s: string }> => {
  const typedData = getTypedData(message, chainId)
  const signature = await provider.send('eth_signTypedData_v4', [message.maker, JSON.stringify(typedData)])
  const { v, r, s } = splitSignature(signature)
  return { v, r, s }
}

export const getSignatureWithProviderCellar = async (
  message: CellarApprovalMessage,
  chainId: ChainId,
  provider: Web3Provider
): Promise<{ v: number; r: string; s: string }> => {
  const typedData = getTypedDataCellar(message, chainId)
  const signature = await provider.send('eth_signTypedData_v4', [message.user, JSON.stringify(typedData)])
  const { v, r, s } = splitSignature(signature)
  return { v, r, s }
}

export const getSignatureCellar = async (cellarApproval: CellarApprovalMessage, chainId: ChainId, privateKey: string) => {
  let domain: Domain = {
    name: 'Cellar V1',
    chainId: chainId,
    verifyingContract: CELLAR_ADDRESS[chainId]
  }
  return sign(
    {
      types: cellarTypes,
      primaryType: 'SetMasterContractApproval',
      domain,
      message: cellarApproval
    },
    privateKey
  )
}
