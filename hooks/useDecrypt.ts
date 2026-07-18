import { useCallback } from 'react'
import CryptoJS from 'crypto-js'

export const useDecrypt = () => {
  const decryptData = useCallback((encryptedString: string) => {
    const decryptionKey = process.env.NEXT_PUBLIC_DECRYPTION_KEY as string

    if (!encryptedString) return ''

    const keyUtf8 = CryptoJS.enc.Utf8.parse(decryptionKey)
    const decodedUrlComponent = decodeURIComponent(encryptedString)

    const decrypted = CryptoJS.AES.decrypt(decodedUrlComponent, keyUtf8, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })

    const result = decrypted.toString(CryptoJS.enc.Utf8)

    return result
  }, [])

  return {
    decryptData
  }
}
