import { BaseAppConfig } from '../app.config';
import * as _ from 'lodash';


export class Utilities {

  static tofixed(toFix: number) {
    let fixedO = toFix.toFixed(2);
    return fixedO.endsWith(".00") ? fixedO.substring(0, fixedO.length - 3) : fixedO;
  }

  static numToFixPlace(toFix: number, toNumPlace) {
    toFix = Number("" + toFix);
    if (toFix == null || isNaN(toFix)) toFix = 0;
    let fixedO = toFix.toFixed(toNumPlace);
    return fixedO;
  }

  static formatCurrency(currency: string, toFix: number) {
    return currency + " " + Utilities.numToFixPlace(toFix, 2);
  }

  static readKey(obj, path, defaultReturn) {
    if (defaultReturn == null || typeof defaultReturn == 'undefined') {
      defaultReturn = null;
    }

    try {
      if (obj === void 0 || obj === null) obj = self ? self : this;
      if (typeof path !== 'string') path = '' + path;
      var c = '', pc, i = 0, n = path.length, name = '';
      if (n) while (i <= n) ((c = path[i++]) == '.' || c == '[' || c == ']' || c == void 0) ? (name ? (obj = obj[name], name = '') : (pc == '.' || pc == '[' || pc == ']' && c == ']' ? i = n + 2 : void 0), pc = c) : name += c;
      if (i == n + 2) {
        return defaultReturn;
      }
      if (typeof obj == 'undefined') {
        return defaultReturn;
      } else {
        return obj;
      }
    } catch (e) {
      return defaultReturn;
    }
  }

  static isDefined(obj) {
    return (obj != null && typeof obj !== "undefined");
  }

  static objSize(obj) {
    let len = 0;
    if (obj != null && typeof obj !== "undefined") {
      try { len = Object.keys(obj).length; } catch (e) { len = 0; }
    }
    return len;
  }

	/**
	 * Generates a GUID string.
	 * @returns {String} The generated GUID.
	*/
  static guid() {
    function _p8(s) {
      var p = (Math.random().toString(16) + "000000000").substr(2, 8);
      return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8(false) + _p8(true) + _p8(true) + _p8(false);
  }

  static deepClone(originalObj): any {
    /*const cloneObj = (<any>object.constructor());
    const attributes = Object.keys(object);
    for (const attribute of attributes) {
        const property = object[attribute];

        if (typeof property === 'object') {
            cloneObj[attribute] = this.deepClone(property);
        } else {
            cloneObj[attribute] = property;
        }
    }
    return cloneObj;*/
    let cloneObj = _.cloneDeep(originalObj);
    return cloneObj;
  }

  static isArray(value: any) {
    return (typeof value === "object" && value instanceof Array);
  }

  static trim(value: any) {
    let val: string;
    try {
      val = ("" + value).trim();
    } catch (e) {
      val = value;
    }
    return val;
  }



  static getLoggedUser() {
    let token = "";
    let user: any = {};
    let tokenDetailsStr = window.sessionStorage.getItem('token');
    if (tokenDetailsStr == null || typeof tokenDetailsStr === "undefined" || tokenDetailsStr == "") {
      let dummyUser = {
        "token": "",
        "login_success": false,
        "account_id": "",
        "first_name": "",
        "last_name": "",
        "email": "",
        "phone": "",
        "user_name": ""
      };
      tokenDetailsStr = JSON.stringify(dummyUser);
    }

    try {
      user = JSON.parse(tokenDetailsStr);
    } catch (e) {
      user = {};
    }
    return user;
  }

  static getToken() {
      let loggeduser = Utilities.getLoggedUser();
      return loggeduser.token;
  }

  static isLogged(){
    let token = Utilities.getToken();
    return (token!=null && typeof token!=="undefined" && Utilities.trim(token)!="");
  }





}
