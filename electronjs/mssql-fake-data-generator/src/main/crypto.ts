import crypto from 'crypto';
const algorithm = 'aes-256-cbc';

export function encrypt(text: string, key: string) {
    console.log("🚀 ~ encrypt ~ key:",text, typeof text, key.length)
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

export function decrypt(encrypted: string, key: string, iv: string) {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}