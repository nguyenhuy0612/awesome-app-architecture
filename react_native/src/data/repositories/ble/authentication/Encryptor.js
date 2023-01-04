import { CUSTOM_IV, CUSTOM_SECRET_KEY } from "../../../../utils/ble/BleEncryptionConstants"
import { convertIntToOneByte, toUtf8Bytes } from "../../../../utils/ble/BleUtil"
import { arrayCopy } from "../../../../utils/common/CommonUtil"
import Constants from "../../../../utils/Constants"
import { logDebug } from "../../../../utils/logger/Logger"


const LOG_TAG = Constants.LOG.BT_CRYPTO

/**
 * load crypto module.
 */
const CryptoJS = require("crypto-js")
var aesjs = require('aes-js')

const Encryptor = () => {

    /**
     * encrypt content bytes.
     * @param {bytes} contentBytes
     * @param {bytes} keyBytes
     * @param {bytes} ivBytes 
     * @returns {bytes}
     */
    getEncryptedMessage = (contentBytes, keyBytes, ivBytes) => {

        const paddingBytes = padding(contentBytes)
        logDebug(LOG_TAG, ">>> contentBytes: " + contentBytes)
        logDebug(LOG_TAG, ">>> contentBytes.length: " + contentBytes.length)
        logDebug(LOG_TAG, ">>> paddingBytes: " + paddingBytes)
        logDebug(LOG_TAG, ">>> paddingBytes.length: " + paddingBytes.length)
        logDebug(LOG_TAG, ">>> keyBytes: " + keyBytes)
        logDebug(LOG_TAG, ">>> ivBytes: " + ivBytes)

        let paddingContentBytesWordArray = CryptoJS.lib.WordArray.create(new Uint8Array(paddingBytes))
        let keyBytesWordArray = CryptoJS.lib.WordArray.create(new Uint8Array(keyBytes))
        let ivBytesWordArray = CryptoJS.lib.WordArray.create(new Uint8Array(ivBytes))

        logDebug(LOG_TAG, ">>> paddingContentBytesWordArray: " + paddingContentBytesWordArray)
        logDebug(LOG_TAG, ">>> paddingContentBytesWordArray,length: " + paddingContentBytesWordArray.length)
        logDebug(LOG_TAG, ">>> keyBytesWordArray: " + keyBytesWordArray)
        logDebug(LOG_TAG, ">>> ivBytesWordArray: " + ivBytesWordArray)

        // crypto encryptor.
        const cipher =
            CryptoJS.AES.encrypt(paddingContentBytesWordArray, keyBytesWordArray, {
                iv: ivBytesWordArray,
                padding: CryptoJS.pad.NoPadding,
                mode: CryptoJS.mode.CBC
            })

        logDebug(LOG_TAG, ">>> cipher: " + cipher)
        logDebug(LOG_TAG, ">>> cipher.ciphertext: " + cipher.ciphertext)
        logDebug(LOG_TAG, ">>> cipher.ciphertext.length: " + cipher.ciphertext.length)
        logDebug(LOG_TAG, ">>> cipher.ciphertext.toString().length: " + cipher.ciphertext.toString().length)
        logDebug(LOG_TAG, ">>> toUtf8Bytes(cipher.ciphertext): " + toUtf8Bytes(cipher.ciphertext))
        logDebug(LOG_TAG, ">>> toUtf8Bytes(cipher.ciphertext.toString()): " + toUtf8Bytes(cipher.ciphertext.toString()))

        return toUtf8Bytes(cipher.ciphertext.toString())
    }

    /**
     * apply padding algorithm to data and return it.
     * @param {bytes} contentBytes
     * @returns {bytes}
     */
    padding = (contentBytes) => {

        const contentLength = contentBytes.length
        const padding = 16 - (contentLength % 16)
        const bufferLength = ((contentLength + 16) / 16) * 16

        logDebug(LOG_TAG,
            ">>> contentLength: " + contentLength
            + ", padding: " + padding
            + ", bufferLength: " + bufferLength
        )

        let buffer = new Array(bufferLength)

        arrayCopy(contentBytes, 0, buffer, 0, contentLength)

        for (let i = contentLength; i < buffer.length; i++) {
            buffer[i] = convertIntToOneByte(padding)[0]
        }
        return buffer
    }

    /**
     * decrypt ble custom data and return it.
     * @param {Any} data
     * @returns {Any}
     */
    getDecryptedMessage = (data) => {

        // crypto decryptor.
        let decryptedData = CryptoJS.AES.decrypt(data, CUSTOM_SECRET_KEY, {
            iv: CUSTOM_IV,
            padding: CryptoJS.pad.NoPadding,
            mode: CryptoJS.mode.CBC
        })

        logDebug(LOG_TAG, "<<< decryption, decryption result: " + decryptedData.toString())

        const depaddedData = getDepaddedData(decryptedData)
        return depaddedData
    }

    /**
     * apply de-padding algorithm to data and return it.
     * @param {Any} data 
     * @returns {Any}
     */
    const getDepaddedData = (data) => {

        let dataAsString = data.toString()

        const dataLength = dataAsString.length
        const dataLengthDividedByTwo = dataLength / 2
        const padding = dataAsString.substr(dataLength - 2, 2)
        const paddingAsInt = parseInt(padding, 16)
        const bufferLength = dataLengthDividedByTwo - paddingAsInt

        logDebug(LOG_TAG, ">>> depadding, "
            + "data length: " + dataLength
            + ", data length divided by 2: " + dataLengthDividedByTwo
            + ", padding: " + padding
            + ", paddingAsInt: " + paddingAsInt
            + ", bufferLength: " + bufferLength)

        let destination = new Array(bufferLength)
        let source = new Array(dataLengthDividedByTwo)

        for (let i = 0; i < source.length; i++) {
            const item = dataAsString.substr(i + i, 2)
            source[i] = item
        }

        arrayCopy(source, 0, destination, 0, dataLengthDividedByTwo - paddingAsInt)

        let depaddingResult = ""
        for (let i = 0; i < destination.length; i++) {
            depaddingResult += destination[i]
        }

        logDebug(LOG_TAG, ">>> depadding, result: " + depaddingResult)
        logDebug(LOG_TAG, ">>> depadding, destination buffer: " + destination)

        return depaddingResult
    }

    return {
        getEncryptedMessage,
        getDecryptedMessage
    }
}

export default Encryptor