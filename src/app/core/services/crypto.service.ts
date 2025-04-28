import { Inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  secretKey: string = '';
  constructor(
    @Inject('CRYPTO_SECRET_KEY') secretKey: string
  ) {
    this.secretKey = secretKey;
  }

  encrypt(value: string) : string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  encryptJsonUriFriendly(json: any) : string {
    const res = CryptoJS.AES.encrypt(JSON.stringify(json), this.secretKey.trim()).toString();
    return encodeURIComponent(res);
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  decryptJsonUriFriendly(textToDecrypt: string) : any {
    const res = CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    return JSON.parse(`${decodeURIComponent(res)}`);
  }
}