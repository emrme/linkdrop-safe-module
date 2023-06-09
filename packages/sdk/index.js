import { generateLink, generateLinkERC721 } from './generateLink'
import { claim, claimERC721 } from './claim'
import { ethers } from 'ethers'
import {
  isGnosisSafe,
  isLinkdropModuleEnabled,
  getEnableLinkdropModuleData
} from './safeUtils'

class SDK {
  constructor ({
    chain = 'rinkeby',
    apiHost = 'https://safe.linkdrop.io',
    claimHost = 'https://claim.linkdrop.io',
    jsonRpcUrl = `https://${chain}.infura.io`,
    linkdropModuleMasterCopy = '0x19Ff4Cb4eFD0b9E04433Dde6507ADC68225757f2',
    createAndAddModules = '0x40Ba7DF971BBdE476517B7d6B908113f71583183',
    proxyFactory = '0x12302fE9c02ff50939BaAaaf415fc226C078613C'
  }) {
    if (chain !== 'rinkeby' && chain !== 'mainnet') {
      throw new Error('Unsupported chain')
    }
    this.chain = chain
    this.jsonRpcUrl = jsonRpcUrl
    this.apiHost = apiHost
    this.claimHost = claimHost
    this.linkdropModuleMasterCopy = linkdropModuleMasterCopy
    this.createAndAddModules = createAndAddModules
    this.proxyFactory = proxyFactory
  }

  async generateLink ({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime
  }) {
    return generateLink({
      claimHost: this.claimHost,
      linkdropModuleAddress,
      signingKeyOrWallet,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime
    })
  }

  async generateLinkERC721 ({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime
  }) {
    return generateLinkERC721({
      claimHost: this.claimHost,
      signingKeyOrWallet,
      linkdropModuleAddress,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime
    })
  }

  async claim ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress
  }) {
    return claim({
      apiHost: this.apiHost,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress
    })
  }

  async claimERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress
  }) {
    return claimERC721({
      apiHost: this.apiHost,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress
    })
  }

  /**
   * Function to get data to enable linkdrop module for existing safe
   * @param {String} safe Existing safe address
   * @param {String} linkdropModuleMasterCopy Linkdrop module master copy address
   * @param {String} createAndAddModules Create and add modules library address
   * @param {String} proxyFactory Proxy factory address
   * @param {String} jsonRpcUrl JSON RPC URL
   * @return {Object} `{data, address}`
   */
  async getEnableLinkdropModuleData (safe) {
    return getEnableLinkdropModuleData({
      safe,
      linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
      createAndAddModules: this.createAndAddModules,
      proxyFactory: this.proxyFactory,
      jsonRpcUrl: this.jsonRpcUrl
    })
  }

  async isGnosisSafe (safe) {
    return isGnosisSafe({ safe, jsonRpcUrl: this.jsonRpcUrl })
  }

  async isLinkdropModuleEnabled (safe) {
    return isLinkdropModuleEnabled({ safe, jsonRpcUrl: this.jsonRpcUrl })
  }
}

export default SDK
