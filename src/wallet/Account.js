import * as core from './core'
import { isPrivateKey, isPublicKey, isWIF, isAddress, isNEP2 } from './verify'

/**
 * @class Account
 * @memberof module:wallet
 * @classdesc
 * This allows for simple utilisation and manipulating of keys without need the long access methods.
 * Key formats are derived from each other lazily and stored for future access.
 * If the previous key (one level higher) is not found, it will attempt to generate it or throw an Error if insufficient information was provided (eg. trying to generate private key when only address was given.)
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 * @param {string} str - WIF/ Private Key / Public Key / Address.
 */
class Account {
  constructor (str) {
    if (isPrivateKey(str)) {
      this._privateKey = str
    } else if (isPublicKey(str, false)) {
      this._publicKey = core.getPublicKeyEncoded(str)
    } else if (isPublicKey(str, true)) {
      this._publicKey = str
    } else if (isAddress(str)) {
      this._address = str
    } else if (isWIF(str)) {
      this._privateKey = core.getPrivateKeyFromWIF(str)
      this._WIF = str
    } else if (isNEP2(str)) {
      throw new ReferenceError(`Account does not support NEP2. Please decode first.`)
    } else {
      throw new ReferenceError(`Invalid input: ${str}`)
    }
  }

  /** @type {string} */
  get WIF () {
    if (this._WIF) {
      return this._WIF
    } else {
      this._WIF = core.getWIFFromPrivateKey(this._privateKey)
      return this._WIF
    }
  }

  /** @type {string} */
  get privateKey () {
    if (this._privateKey) {
      return this._privateKey
    } else {
      throw new ReferenceError('No Private Key provided!')
    }
  }

  /**
   * Returns the public key in encoded form. This is the form that is the short version (starts with 02 or 03). If you require the unencoded form, do use the publicKey method instead of this getter.
   * @type {string}
   *  */
  get publicKey () {
    if (this._publicKey) {
      return this._publicKey
    } else {
      this._publicKey = core.getPublicKeyFromPrivateKey(this.privateKey)
      return this._publicKey
    }
  }

  /** Retrieves the Public Key in encoded / unencoded form.
   * @param {boolean} encoded - Encoded or unencoded.
   * @return {string}
   */
  getPublicKey (encoded = true) {
    if (encoded) return this.publicKey
    else {
      let encoded = this.publicKey
      return core.getPublicKeyUnencoded(encoded)
    }
  }

  /** @type {string} */
  get scriptHash () {
    if (this._scriptHash) {
      return this._scriptHash
    } else {
      if (this._address) {
        this._scriptHash = core.getScriptHashFromAddress(this.address)
        return this._scriptHash
      } else {
        this._scriptHash = core.getScriptHashFromPublicKey(this.publicKey)
        return this._scriptHash
      }
    }
  }

  /** @type {string} */
  get address () {
    if (this._address) {
      return this._address
    } else {
      this._address = core.getAddressFromScriptHash(this.scriptHash)
      return this._address
    }
  }
}

export default Account
