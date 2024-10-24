import*as Log from '../util/logging.js';import{stopEvent}from '../util/events.js';import*as KeyboardUtil from "./util.js";import KeyTable from "./keysym.js";import*as browser from "../util/browser.js";export default class Keyboard{constructor(target){this._target=target||null;this._keyDownList={};this._pendingKey=null;this._altGrArmed=false;this._eventHandlers={'keyup':this._handleKeyUp.bind(this),'keydown':this._handleKeyDown.bind(this),'keypress':this._handleKeyPress.bind(this),'blur':this._allKeysUp.bind(this),'checkalt':this._checkAlt.bind(this),};this.onkeyevent=()=>{};}
_sendKeyEvent(keysym,code,down){if(down){this._keyDownList[code]=keysym;}else{if(!(code in this._keyDownList)){return;}
delete this._keyDownList[code];}
Log.Debug("onkeyevent "+(down?"down":"up")+
", keysym: "+keysym,", code: "+code);this.onkeyevent(keysym,code,down);}
_getKeyCode(e){const code=KeyboardUtil.getKeycode(e);if(code!=='Unidentified'){return code;}
if(e.keyCode&&(e.type!=='keypress')){if(e.keyCode!==229){return 'Platform'+e.keyCode;}}
if(e.keyIdentifier){if(e.keyIdentifier.substr(0,2)!=='U+'){return e.keyIdentifier;}
const codepoint=parseInt(e.keyIdentifier.substr(2),16);const char=String.fromCharCode(codepoint).toUpperCase();return 'Platform'+char.charCodeAt();}
return 'Unidentified';}
_handleKeyDown(e){const code=this._getKeyCode(e);let keysym=KeyboardUtil.getKeysym(e);if(this._altGrArmed){this._altGrArmed=false;clearTimeout(this._altGrTimeout);if((code==="AltRight")&&((e.timeStamp-this._altGrCtrlTime)<50)){keysym=KeyTable.XK_ISO_Level3_Shift;}else{this._sendKeyEvent(KeyTable.XK_Control_L,"ControlLeft",true);}}
if(code==='Unidentified'){if(keysym){this._sendKeyEvent(keysym,code,true);this._sendKeyEvent(keysym,code,false);}
stopEvent(e);return;}
if(browser.isMac()||browser.isIOS()){switch(keysym){case KeyTable.XK_Super_L:keysym=KeyTable.XK_Alt_L;break;case KeyTable.XK_Super_R:keysym=KeyTable.XK_Super_L;break;case KeyTable.XK_Alt_L:keysym=KeyTable.XK_Mode_switch;break;case KeyTable.XK_Alt_R:keysym=KeyTable.XK_ISO_Level3_Shift;break;}}
if(code in this._keyDownList){keysym=this._keyDownList[code];}
if((browser.isMac()||browser.isIOS())&&(code==='CapsLock')){this._sendKeyEvent(KeyTable.XK_Caps_Lock,'CapsLock',true);this._sendKeyEvent(KeyTable.XK_Caps_Lock,'CapsLock',false);stopEvent(e);return;}
if(!keysym&&(!e.key||browser.isIE()||browser.isEdge())){this._pendingKey=code;setTimeout(this._handleKeyPressTimeout.bind(this),10,e);return;}
this._pendingKey=null;stopEvent(e);if((code==="ControlLeft")&&browser.isWindows()&&!("ControlLeft"in this._keyDownList)){this._altGrArmed=true;this._altGrTimeout=setTimeout(this._handleAltGrTimeout.bind(this),100);this._altGrCtrlTime=e.timeStamp;return;}
this._sendKeyEvent(keysym,code,true);}
_handleKeyPress(e){stopEvent(e);if(this._pendingKey===null){return;}
let code=this._getKeyCode(e);const keysym=KeyboardUtil.getKeysym(e);if((code!=='Unidentified')&&(code!=this._pendingKey)){return;}
code=this._pendingKey;this._pendingKey=null;if(!keysym){Log.Info('keypress with no keysym:',e);return;}
this._sendKeyEvent(keysym,code,true);}
_handleKeyPressTimeout(e){if(this._pendingKey===null){return;}
let keysym;const code=this._pendingKey;this._pendingKey=null;if((e.keyCode>=0x30)&&(e.keyCode<=0x39)){keysym=e.keyCode;}else if((e.keyCode>=0x41)&&(e.keyCode<=0x5a)){let char=String.fromCharCode(e.keyCode);if(e.shiftKey){char=char.toUpperCase();}else{char=char.toLowerCase();}
keysym=char.charCodeAt();}else{keysym=0;}
this._sendKeyEvent(keysym,code,true);}
_handleKeyUp(e){stopEvent(e);const code=this._getKeyCode(e);if(this._altGrArmed){this._altGrArmed=false;clearTimeout(this._altGrTimeout);this._sendKeyEvent(KeyTable.XK_Control_L,"ControlLeft",true);}
if((browser.isMac()||browser.isIOS())&&(code==='CapsLock')){this._sendKeyEvent(KeyTable.XK_Caps_Lock,'CapsLock',true);this._sendKeyEvent(KeyTable.XK_Caps_Lock,'CapsLock',false);return;}
this._sendKeyEvent(this._keyDownList[code],code,false);if(browser.isWindows()&&((code==='ShiftLeft')||(code==='ShiftRight'))){if('ShiftRight'in this._keyDownList){this._sendKeyEvent(this._keyDownList['ShiftRight'],'ShiftRight',false);}
if('ShiftLeft'in this._keyDownList){this._sendKeyEvent(this._keyDownList['ShiftLeft'],'ShiftLeft',false);}}}
_handleAltGrTimeout(){this._altGrArmed=false;clearTimeout(this._altGrTimeout);this._sendKeyEvent(KeyTable.XK_Control_L,"ControlLeft",true);}
_allKeysUp(){Log.Debug(">> Keyboard.allKeysUp");for(let code in this._keyDownList){this._sendKeyEvent(this._keyDownList[code],code,false);}
Log.Debug("<< Keyboard.allKeysUp");}
_checkAlt(e){if(e.skipCheckAlt){return;}
if(e.altKey){return;}
const target=this._target;const downList=this._keyDownList;['AltLeft','AltRight'].forEach((code)=>{if(!(code in downList)){return;}
const event=new KeyboardEvent('keyup',{key:downList[code],code:code});event.skipCheckAlt=true;target.dispatchEvent(event);});}
grab(){this._target.addEventListener('keydown',this._eventHandlers.keydown);this._target.addEventListener('keyup',this._eventHandlers.keyup);this._target.addEventListener('keypress',this._eventHandlers.keypress);window.addEventListener('blur',this._eventHandlers.blur);if(browser.isWindows()&&browser.isFirefox()){const handler=this._eventHandlers.checkalt;['mousedown','mouseup','mousemove','wheel','touchstart','touchend','touchmove','keydown','keyup'].forEach(type=>document.addEventListener(type,handler,{capture:true,passive:true}));}}
ungrab(){if(browser.isWindows()&&browser.isFirefox()){const handler=this._eventHandlers.checkalt;['mousedown','mouseup','mousemove','wheel','touchstart','touchend','touchmove','keydown','keyup'].forEach(type=>document.removeEventListener(type,handler));}
this._target.removeEventListener('keydown',this._eventHandlers.keydown);this._target.removeEventListener('keyup',this._eventHandlers.keyup);this._target.removeEventListener('keypress',this._eventHandlers.keypress);window.removeEventListener('blur',this._eventHandlers.blur);this._allKeysUp();}}