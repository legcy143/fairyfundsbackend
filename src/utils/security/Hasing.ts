import crypto from 'crypto';

export function encryption(text: any, key: any) {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return { encrypted, iv: iv.toString('hex') };
    } catch (e) {
        return -1;
    }
}

export function decryption(encryptedText: any, iv: string , key: any) {
    try{
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
      }
      catch(e){
        return -1
      }
}

export function SecretKeyConverter(text:string) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest();
}