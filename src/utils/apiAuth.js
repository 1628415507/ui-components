import CryptoJS from 'crypto-js'

// const decryptKey = 'cYFzYYxujbh3mrXPJJCiXFGZL01nM7wuWDmim1js4FQ='

export function encrypt(plainText, decryptKey) {
    const key = CryptoJS.enc.Base64.parse(decryptKey);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    // 这里的encrypted不是字符串，而是一个CipherParams对象
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function decrypt(cipherText, decryptKey) {
    const key = CryptoJS.enc.Base64.parse(decryptKey);
    // 返回的是一个Word Array Object，其实就是Java里的字节数组
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

export function signature(data, securetKey) {
    const content = data + securetKey;
    return CryptoJS.SHA256(content).toString()
}


// 加密解密参考链接：https://blog.csdn.net/lingbomanbu_lyl/article/details/125238945