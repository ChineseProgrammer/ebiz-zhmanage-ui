/**
 * 工具类
 */
import Vue from 'vue'
import CryptoJS from 'crypto-js'
export default {
    encryptByAES(message)  {
        let key  = CryptoJS.enc.Latin1.parse('aaaaaaaaaaaaaaaa');
var iv   = CryptoJS.enc.Latin1.parse('aaaaaaaaaaaaaaaa');
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.AES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64).replace(/[\r\n]/g, '');
    },
    //加密
    EncryptData(data) {
        var srcs = CryptoJS.enc.Utf8.parse(data);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode : CryptoJS.mode.ECB,
            padding : CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    
  //解密
  DecryptData(data) {
    let key  = CryptoJS.enc.Latin1.parse('aaaaaaaaaaaaaaaa');
    var iv   = CryptoJS.enc.Latin1.parse('aaaaaaaaaaaaaaaa');
	var stime = new Date().getTime();
	var decrypt = CryptoJS.AES.decrypt(data, key, {
		mode : CryptoJS.mode.ECB,
		padding : CryptoJS.pad.Pkcs7
    });
    console.log(CryptoJS.enc.Utf8.stringify(decrypt))
	var result = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
	var etime = new Date().getTime();
	console.log("DecryptData Time:" + (etime - stime));
	return result;
}

}