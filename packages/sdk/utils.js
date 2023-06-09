const ethers = require('ethers')

/**
 * @description Function to create link for ETH and/or ERC20
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {Number} tokenAmount Amount of tokens
 * @param {Number} expirationTime Link expiration timestamp
 * @return {Object}
 */
export const createLink = async ({
  signingKeyOrWallet,
  linkdropModuleAddress,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime
}) => {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address

  let linkdropSignerSignature = await signLink({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId
  })

  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop signer
  }
}

/**
 * @description Function to sign link
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {Number} weiAmount Amount of wei
 * @param {String} tokenAddress Address of token contract
 * @param {Number} tokenAmount Amount of tokens
 * @param {Number} expirationTime Link expiration timestamp
 * @param {String} linkId Link id
 * @return {String} signature
 */
const signLink = async function ({
  signingKeyOrWallet,
  linkdropModuleAddress,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  linkId
}) {
  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet)
  }

  let messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'address', 'uint', 'uint', 'address'],
    [
      linkdropModuleAddress,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId
    ]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  return signingKeyOrWallet.signMessage(messageHashToSign)
}

/**
 * @description Function to create link for ETH and/or ERC721
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Wei amount
 * @param {String} nftAddress NFT address
 * @param {Number} tokenId Token id
 * @param {Number} expirationTime Link expiration timestamp
 * @return {Object}
 */
export const createLinkERC721 = async ({
  signingKeyOrWallet,
  linkdropModuleAddress,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime
}) => {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address

  let linkdropSignerSignature = await signLinkERC721({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId
  })

  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop signer
  }
}

/**
 * @description Function to sign link for ERC721
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {Number} weiAmount Amount of wei
 * @param {String} nftAddresss Address of NFT
 * @param {Number} tokenId Token id
 * @param {Number} expirationTime Link expiration timestamp
 * @param {String} linkId Link id
 * @return {String} signature
 */
const signLinkERC721 = async function ({
  signingKeyOrWallet,
  linkdropModuleAddress,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  linkId
}) {
  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet)
  }

  let messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'address', 'uint', 'uint', 'address'],
    [
      linkdropModuleAddress,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId
    ]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  return signingKeyOrWallet.signMessage(messageHashToSign)
}

/**
 * @description Function to sign receiver address
 * @param {String} linkKey Ephemeral key attached to link
 * @param {String} receiverAddress Receiver address
 */
export const signReceiverAddress = async (linkKey, receiverAddress) => {
  let wallet = new ethers.Wallet(linkKey)
  let messageHash = ethers.utils.solidityKeccak256(
    ['address'],
    [receiverAddress]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  return wallet.signMessage(messageHashToSign)
}

export const buildCreate2Address = (creatorAddress, saltHex, byteCode) => {
  const byteCodeHash = ethers.utils.keccak256(byteCode)
  return `0x${ethers.utils
    .keccak256(
      `0x${['ff', creatorAddress, saltHex, byteCodeHash]
        .map(x => x.replace(/0x/, ''))
        .join('')}`
    )
    .slice(-40)}`.toLowerCase()
}
