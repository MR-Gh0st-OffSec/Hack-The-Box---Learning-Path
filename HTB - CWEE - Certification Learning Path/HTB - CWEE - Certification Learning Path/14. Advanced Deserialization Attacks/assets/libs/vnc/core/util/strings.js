export function decodeUTF8(utf8string,allowLatin1=false){try{return decodeURIComponent(escape(utf8string));}catch(e){if(e instanceof URIError){if(allowLatin1){return utf8string;}}
throw e;}}
export function encodeUTF8(DOMString){return unescape(encodeURIComponent(DOMString));}