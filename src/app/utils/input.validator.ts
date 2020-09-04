declare var moment: any;

export class InputValidator {

    static isEmail(value: string = "") {
    	return  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
    }

    static isUrl(value: string = "") {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(value);
    }

    static isDate(value: string = "", format: string = "dd/mm/yyyy") {
      if(format==null || typeof format ==="undefined" || (""+format).trim()=="") format =  "dd/mm/yyyy";
      format = format.toUpperCase();
      var pattern = new RegExp(pattern);
    	return moment(value, format,true).isValid();
    }

    static isNumber(value: any){
    	return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
    }

    static hasDigitsOnly(value: any){
    	return /^\d+$/.test( value );
    }

    static minLength(value: string = "", requiredMinLength: number = 1){
    	var length = value.length;
    	return length >= requiredMinLength;
    }

    static maxLength(value: string = "", requiredMaxLength: number = 1){
    	var length = value.length;
    	return length <= requiredMaxLength;
    }

    static equalTo(value1: string = "",value2: string = ""){
    	return value1 === value2;
    }

    static hasMinimum( value: any, param: number = 0 ) {
      return Number(""+value) >= param;
    }

    static hasMaximum( value: any, param: number = 0 ) {
      return Number(""+value) <= param;
    }

    static isPhone(value: any){
      //let phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
      //let mobileno = /^([0-9]{10}$/;
      return /^\d{10}$/.test(value);
    }

    static isEmpty( value: any) {
      //console.log("Type of '",value,"'", typeof value);
      if(value==null || typeof value === "undefined") value = "";
      if(typeof value === "string"){
        return (InputValidator.trim(value)=="");
      }

      if(typeof value === "object" && !(value instanceof Array)){
        let len = 0;
        try{
          len = (value!=null && typeof value!== "undefined") ? Object.keys(value).length : 0;
        }catch(e){ len = 0; }
        return (len==0);
      }

      if(typeof value === "object" && value instanceof Array){
        let len = 0;
        try{
          len = (value!=null && typeof value!== "undefined") ? value.length : 0;
        }catch(e){ len = 0; }
        return (len==0);
      }

      if((value!=null && typeof value!== "undefined") && (typeof value === "number" || typeof value === "boolean" ||(typeof value==="object" && value instanceof Date))){
        return false;
      }
      return true;
    }

    static trim(value: string = ""){
      if(value==null || typeof value === "undefined") value = "";
      return (""+value).trim();
    }

    static isArray(value: any){
      return (value!=null && typeof value !== "undefined" && typeof value === "object" && value instanceof Array);
    }
}
