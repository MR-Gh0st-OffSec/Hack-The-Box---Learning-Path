import KeyTable from "./keysym.js";import keysyms from "./keysymdef.js";import vkeys from "./vkeys.js";import fixedkeys from "./fixedkeys.js";import DOMKeyTable from "./domkeytable.js";import*as browser from "../util/browser.js";export function getKeycode(evt){if(evt.code){switch(evt.code){case 'OSLeft':return 'MetaLeft';case 'OSRight':return 'MetaRight';}
return evt.code;}
if((evt.type!=='keypress')&&(evt.keyCode in vkeys)){let code=vkeys[evt.keyCode];if(browser.isMac()&&(code==='ContextMenu')){code='MetaRight';}
if(evt.location===2){switch(code){case 'ShiftLeft':return 'ShiftRight';case 'ControlLeft':return 'ControlRight';case 'AltLeft':return 'AltRight';}}
if(evt.location===3){switch(code){case 'Delete':return 'NumpadDecimal';case 'Insert':return 'Numpad0';case 'End':return 'Numpad1';case 'ArrowDown':return 'Numpad2';case 'PageDown':return 'Numpad3';case 'ArrowLeft':return 'Numpad4';case 'ArrowRight':return 'Numpad6';case 'Home':return 'Numpad7';case 'ArrowUp':return 'Numpad8';case 'PageUp':return 'Numpad9';case 'Enter':return 'NumpadEnter';}}
return code;}
return 'Unidentified';}
export function getKey(evt){if(evt.key!==undefined){switch(evt.key){case 'Spacebar':return ' ';case 'Esc':return 'Escape';case 'Scroll':return 'ScrollLock';case 'Win':return 'Meta';case 'Apps':return 'ContextMenu';case 'Up':return 'ArrowUp';case 'Left':return 'ArrowLeft';case 'Right':return 'ArrowRight';case 'Down':return 'ArrowDown';case 'Del':return 'Delete';case 'Divide':return '/';case 'Multiply':return '*';case 'Subtract':return '-';case 'Add':return '+';case 'Decimal':return evt.char;}
switch(evt.key){case 'OS':return 'Meta';case 'LaunchMyComputer':return 'LaunchApplication1';case 'LaunchCalculator':return 'LaunchApplication2';}
switch(evt.key){case 'UIKeyInputUpArrow':return 'ArrowUp';case 'UIKeyInputDownArrow':return 'ArrowDown';case 'UIKeyInputLeftArrow':return 'ArrowLeft';case 'UIKeyInputRightArrow':return 'ArrowRight';case 'UIKeyInputEscape':return 'Escape';}
if((evt.key==='\x00')&&(evt.code==='NumpadDecimal')){return 'Delete';}
if(!browser.isIE()&&!browser.isEdge()){return evt.key;}
if((evt.key.length!==1)&&(evt.key!=='Unidentified')){return evt.key;}}
const code=getKeycode(evt);if(code in fixedkeys){return fixedkeys[code];}
if(evt.charCode){return String.fromCharCode(evt.charCode);}
return 'Unidentified';}
export function getKeysym(evt){const key=getKey(evt);if(key==='Unidentified'){return null;}
if(key in DOMKeyTable){let location=evt.location;if((key==='Meta')&&(location===0)){location=2;}
if((key==='Clear')&&(location===3)){let code=getKeycode(evt);if(code==='NumLock'){location=0;}}
if((location===undefined)||(location>3)){location=0;}
if(key==='Meta'){let code=getKeycode(evt);if(code==='AltLeft'){return KeyTable.XK_Meta_L;}else if(code==='AltRight'){return KeyTable.XK_Meta_R;}}
if(key==='Clear'){let code=getKeycode(evt);if(code==='NumLock'){return KeyTable.XK_Num_Lock;}}
return DOMKeyTable[key][location];}
if(key.length!==1){return null;}
const codepoint=key.charCodeAt();if(codepoint){return keysyms.lookup(codepoint);}
return null;}