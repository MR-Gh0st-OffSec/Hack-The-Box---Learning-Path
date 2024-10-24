import{toUnsigned32bit,toSigned32bit}from './util/int.js';import*as Log from './util/logging.js';import{encodeUTF8,decodeUTF8}from './util/strings.js';import{dragThreshold}from './util/browser.js';import EventTargetMixin from './util/eventtarget.js';import Display from "./display.js";import Inflator from "./inflator.js";import Deflator from "./deflator.js";import Keyboard from "./input/keyboard.js";import Mouse from "./input/mouse.js";import Cursor from "./util/cursor.js";import Websock from "./websock.js";import DES from "./des.js";import KeyTable from "./input/keysym.js";import XtScancode from "./input/xtscancodes.js";import{encodings}from "./encodings.js";import "./util/polyfill.js";import RawDecoder from "./decoders/raw.js";import CopyRectDecoder from "./decoders/copyrect.js";import RREDecoder from "./decoders/rre.js";import HextileDecoder from "./decoders/hextile.js";import TightDecoder from "./decoders/tight.js";import TightPNGDecoder from "./decoders/tightpng.js";const DISCONNECT_TIMEOUT=3;const DEFAULT_BACKGROUND='rgb(40, 40, 40)';const extendedClipboardFormatText=1;const extendedClipboardFormatRtf=1<<1;const extendedClipboardFormatHtml=1<<2;const extendedClipboardFormatDib=1<<3;const extendedClipboardFormatFiles=1<<4;const extendedClipboardActionCaps=1<<24;const extendedClipboardActionRequest=1<<25;const extendedClipboardActionPeek=1<<26;const extendedClipboardActionNotify=1<<27;const extendedClipboardActionProvide=1<<28;export default class RFB extends EventTargetMixin{constructor(target,url,options){if(!target){throw new Error("Must specify target");}
if(!url){throw new Error("Must specify URL");}
super();this._target=target;this._url=url;options=options||{};this._rfb_credentials=options.credentials||{};this._shared='shared'in options?!!options.shared:true;this._repeaterID=options.repeaterID||'';this._wsProtocols=options.wsProtocols||[];this._rfb_connection_state='';this._rfb_init_state='';this._rfb_auth_scheme=-1;this._rfb_clean_disconnect=true;this._rfb_version=0;this._rfb_max_version=3.8;this._rfb_tightvnc=false;this._rfb_vencrypt_state=0;this._rfb_xvp_ver=0;this._fb_width=0;this._fb_height=0;this._fb_name="";this._capabilities={power:false};this._supportsFence=false;this._supportsContinuousUpdates=false;this._enabledContinuousUpdates=false;this._supportsSetDesktopSize=false;this._screen_id=0;this._screen_flags=0;this._qemuExtKeyEventSupported=false;this._clipboardText=null;this._clipboardServerCapabilitiesActions={};this._clipboardServerCapabilitiesFormats={};this._sock=null;this._display=null;this._flushing=false;this._keyboard=null;this._mouse=null;this._disconnTimer=null;this._resizeTimeout=null;this._decoders={};this._FBU={rects:0,x:0,y:0,width:0,height:0,encoding:null,};this._mouse_buttonMask=0;this._mouse_arr=[];this._viewportDragging=false;this._viewportDragPos={};this._viewportHasMoved=false;this._eventHandlers={focusCanvas:this._focusCanvas.bind(this),windowResize:this._windowResize.bind(this),};Log.Debug(">> RFB.constructor");this._screen=document.createElement('div');this._screen.style.display='flex';this._screen.style.width='100%';this._screen.style.height='100%';this._screen.style.overflow='auto';this._screen.style.background=DEFAULT_BACKGROUND;this._canvas=document.createElement('canvas');this._canvas.style.margin='auto';this._canvas.style.outline='none';this._canvas.style.flexShrink='0';this._canvas.width=0;this._canvas.height=0;this._canvas.tabIndex=-1;this._screen.appendChild(this._canvas);this._cursor=new Cursor();this._cursorImage=RFB.cursors.none;this._decoders[encodings.encodingRaw]=new RawDecoder();this._decoders[encodings.encodingCopyRect]=new CopyRectDecoder();this._decoders[encodings.encodingRRE]=new RREDecoder();this._decoders[encodings.encodingHextile]=new HextileDecoder();this._decoders[encodings.encodingTight]=new TightDecoder();this._decoders[encodings.encodingTightPNG]=new TightPNGDecoder();try{this._display=new Display(this._canvas);}catch(exc){Log.Error("Display exception: "+exc);throw exc;}
this._display.onflush=this._onFlush.bind(this);this._keyboard=new Keyboard(this._canvas);this._keyboard.onkeyevent=this._handleKeyEvent.bind(this);this._mouse=new Mouse(this._canvas);this._mouse.onmousebutton=this._handleMouseButton.bind(this);this._mouse.onmousemove=this._handleMouseMove.bind(this);this._sock=new Websock();this._sock.on('message',()=>{this._handle_message();});this._sock.on('open',()=>{if((this._rfb_connection_state==='connecting')&&(this._rfb_init_state==='')){this._rfb_init_state='ProtocolVersion';Log.Debug("Starting VNC handshake");}else{this._fail("Unexpected server connection while "+
this._rfb_connection_state);}});this._sock.on('close',(e)=>{Log.Debug("WebSocket on-close event");let msg="";if(e.code){msg="(code: "+e.code;if(e.reason){msg+=", reason: "+e.reason;}
msg+=")";}
switch(this._rfb_connection_state){case 'connecting':this._fail("Connection closed "+msg);break;case 'connected':this._updateConnectionState('disconnecting');this._updateConnectionState('disconnected');break;case 'disconnecting':this._updateConnectionState('disconnected');break;case 'disconnected':this._fail("Unexpected server disconnect "+
"when already disconnected "+msg);break;default:this._fail("Unexpected server disconnect before connecting "+
msg);break;}
this._sock.off('close');});this._sock.on('error',e=>Log.Warn("WebSocket on-error event"));setTimeout(this._updateConnectionState.bind(this,'connecting'));Log.Debug("<< RFB.constructor");this.dragViewport=false;this.focusOnClick=true;this._viewOnly=false;this._clipViewport=false;this._scaleViewport=false;this._resizeSession=false;this._showDotCursor=false;if(options.showDotCursor!==undefined){Log.Warn("Specifying showDotCursor as a RFB constructor argument is deprecated");this._showDotCursor=options.showDotCursor;}
this._qualityLevel=6;}
get viewOnly(){return this._viewOnly;}
set viewOnly(viewOnly){this._viewOnly=viewOnly;if(this._rfb_connection_state==="connecting"||this._rfb_connection_state==="connected"){if(viewOnly){this._keyboard.ungrab();this._mouse.ungrab();}else{this._keyboard.grab();this._mouse.grab();}}}
get capabilities(){return this._capabilities;}
get touchButton(){return this._mouse.touchButton;}
set touchButton(button){this._mouse.touchButton=button;}
get clipViewport(){return this._clipViewport;}
set clipViewport(viewport){this._clipViewport=viewport;this._updateClip();}
get scaleViewport(){return this._scaleViewport;}
set scaleViewport(scale){this._scaleViewport=scale;if(scale&&this._clipViewport){this._updateClip();}
this._updateScale();if(!scale&&this._clipViewport){this._updateClip();}}
get resizeSession(){return this._resizeSession;}
set resizeSession(resize){this._resizeSession=resize;if(resize){this._requestRemoteResize();}}
get showDotCursor(){return this._showDotCursor;}
set showDotCursor(show){this._showDotCursor=show;this._refreshCursor();}
get background(){return this._screen.style.background;}
set background(cssValue){this._screen.style.background=cssValue;}
get qualityLevel(){return this._qualityLevel;}
set qualityLevel(qualityLevel){if(!Number.isInteger(qualityLevel)||qualityLevel<0||qualityLevel>9){Log.Error("qualityLevel must be an integer between 0 and 9");return;}
if(this._qualityLevel===qualityLevel){return;}
this._qualityLevel=qualityLevel;if(this._rfb_connection_state==='connected'){this._sendEncodings();}}
disconnect(){this._updateConnectionState('disconnecting');this._sock.off('error');this._sock.off('message');this._sock.off('open');}
sendCredentials(creds){this._rfb_credentials=creds;setTimeout(this._init_msg.bind(this),0);}
sendCtrlAltDel(){if(this._rfb_connection_state!=='connected'||this._viewOnly){return;}
Log.Info("Sending Ctrl-Alt-Del");this.sendKey(KeyTable.XK_Control_L,"ControlLeft",true);this.sendKey(KeyTable.XK_Alt_L,"AltLeft",true);this.sendKey(KeyTable.XK_Delete,"Delete",true);this.sendKey(KeyTable.XK_Delete,"Delete",false);this.sendKey(KeyTable.XK_Alt_L,"AltLeft",false);this.sendKey(KeyTable.XK_Control_L,"ControlLeft",false);}
machineShutdown(){this._xvpOp(1,2);}
machineReboot(){this._xvpOp(1,3);}
machineReset(){this._xvpOp(1,4);}
sendKey(keysym,code,down){if(this._rfb_connection_state!=='connected'||this._viewOnly){return;}
if(down===undefined){this.sendKey(keysym,code,true);this.sendKey(keysym,code,false);return;}
const scancode=XtScancode[code];if(this._qemuExtKeyEventSupported&&scancode){keysym=keysym||0;Log.Info("Sending key ("+(down?"down":"up")+"): keysym "+keysym+", scancode "+scancode);RFB.messages.QEMUExtendedKeyEvent(this._sock,keysym,down,scancode);}else{if(!keysym){return;}
Log.Info("Sending keysym ("+(down?"down":"up")+"): "+keysym);RFB.messages.keyEvent(this._sock,keysym,down?1:0);}}
focus(){this._canvas.focus();}
blur(){this._canvas.blur();}
clipboardPasteFrom(text){if(this._rfb_connection_state!=='connected'||this._viewOnly){return;}
if(this._clipboardServerCapabilitiesFormats[extendedClipboardFormatText]&&this._clipboardServerCapabilitiesActions[extendedClipboardActionNotify]){this._clipboardText=text;RFB.messages.extendedClipboardNotify(this._sock,[extendedClipboardFormatText]);}else{let data=new Uint8Array(text.length);for(let i=0;i<text.length;i++){data[i]=text.charCodeAt(i);}
RFB.messages.clientCutText(this._sock,data);}}
_connect(){Log.Debug(">> RFB.connect");Log.Info("connecting to "+this._url);try{this._sock.open(this._url,this._wsProtocols);}catch(e){if(e.name==='SyntaxError'){this._fail("Invalid host or port ("+e+")");}else{this._fail("Error when opening socket ("+e+")");}}
this._target.appendChild(this._screen);this._cursor.attach(this._canvas);this._refreshCursor();window.addEventListener('resize',this._eventHandlers.windowResize);this._canvas.addEventListener("mousedown",this._eventHandlers.focusCanvas);this._canvas.addEventListener("touchstart",this._eventHandlers.focusCanvas);Log.Debug("<< RFB.connect");}
_disconnect(){Log.Debug(">> RFB.disconnect");this._cursor.detach();this._canvas.removeEventListener("mousedown",this._eventHandlers.focusCanvas);this._canvas.removeEventListener("touchstart",this._eventHandlers.focusCanvas);window.removeEventListener('resize',this._eventHandlers.windowResize);this._keyboard.ungrab();this._mouse.ungrab();this._sock.close();try{this._target.removeChild(this._screen);}catch(e){if(e.name==='NotFoundError'){}else{throw e;}}
clearTimeout(this._resizeTimeout);Log.Debug("<< RFB.disconnect");}
_focusCanvas(event){if(event.defaultPrevented){return;}
if(!this.focusOnClick){return;}
this.focus();}
_setDesktopName(name){this._fb_name=name;this.dispatchEvent(new CustomEvent("desktopname",{detail:{name:this._fb_name}}));}
_windowResize(event){window.requestAnimationFrame(()=>{this._updateClip();this._updateScale();});if(this._resizeSession){clearTimeout(this._resizeTimeout);this._resizeTimeout=setTimeout(this._requestRemoteResize.bind(this),500);}}
_updateClip(){const cur_clip=this._display.clipViewport;let new_clip=this._clipViewport;if(this._scaleViewport){new_clip=false;}
if(cur_clip!==new_clip){this._display.clipViewport=new_clip;}
if(new_clip){const size=this._screenSize();this._display.viewportChangeSize(size.w,size.h);this._fixScrollbars();}}
_updateScale(){if(!this._scaleViewport){this._display.scale=1.0;}else{const size=this._screenSize();this._display.autoscale(size.w,size.h);}
this._fixScrollbars();}
_requestRemoteResize(){clearTimeout(this._resizeTimeout);this._resizeTimeout=null;if(!this._resizeSession||this._viewOnly||!this._supportsSetDesktopSize){return;}
const size=this._screenSize();RFB.messages.setDesktopSize(this._sock,Math.floor(size.w),Math.floor(size.h),this._screen_id,this._screen_flags);Log.Debug('Requested new desktop size: '+
size.w+'x'+size.h);}
_screenSize(){let r=this._screen.getBoundingClientRect();return{w:r.width,h:r.height};}
_fixScrollbars(){const orig=this._screen.style.overflow;this._screen.style.overflow='hidden';this._screen.getBoundingClientRect();this._screen.style.overflow=orig;}
_updateConnectionState(state){const oldstate=this._rfb_connection_state;if(state===oldstate){Log.Debug("Already in state '"+state+"', ignoring");return;}
if(oldstate==='disconnected'){Log.Error("Tried changing state of a disconnected RFB object");return;}
switch(state){case 'connected':if(oldstate!=='connecting'){Log.Error("Bad transition to connected state, "+
"previous connection state: "+oldstate);return;}
break;case 'disconnected':if(oldstate!=='disconnecting'){Log.Error("Bad transition to disconnected state, "+
"previous connection state: "+oldstate);return;}
break;case 'connecting':if(oldstate!==''){Log.Error("Bad transition to connecting state, "+
"previous connection state: "+oldstate);return;}
break;case 'disconnecting':if(oldstate!=='connected'&&oldstate!=='connecting'){Log.Error("Bad transition to disconnecting state, "+
"previous connection state: "+oldstate);return;}
break;default:Log.Error("Unknown connection state: "+state);return;}
this._rfb_connection_state=state;Log.Debug("New state '"+state+"', was '"+oldstate+"'.");if(this._disconnTimer&&state!=='disconnecting'){Log.Debug("Clearing disconnect timer");clearTimeout(this._disconnTimer);this._disconnTimer=null;this._sock.off('close');}
switch(state){case 'connecting':this._connect();break;case 'connected':this.dispatchEvent(new CustomEvent("connect",{detail:{}}));break;case 'disconnecting':this._disconnect();this._disconnTimer=setTimeout(()=>{Log.Error("Disconnection timed out.");this._updateConnectionState('disconnected');},DISCONNECT_TIMEOUT*1000);break;case 'disconnected':this.dispatchEvent(new CustomEvent("disconnect",{detail:{clean:this._rfb_clean_disconnect}}));break;}}
_fail(details){switch(this._rfb_connection_state){case 'disconnecting':Log.Error("Failed when disconnecting: "+details);break;case 'connected':Log.Error("Failed while connected: "+details);break;case 'connecting':Log.Error("Failed when connecting: "+details);break;default:Log.Error("RFB failure: "+details);break;}
this._rfb_clean_disconnect=false;this._updateConnectionState('disconnecting');this._updateConnectionState('disconnected');return false;}
_setCapability(cap,val){this._capabilities[cap]=val;this.dispatchEvent(new CustomEvent("capabilities",{detail:{capabilities:this._capabilities}}));}
_handle_message(){if(this._sock.rQlen===0){Log.Warn("handle_message called on an empty receive queue");return;}
switch(this._rfb_connection_state){case 'disconnected':Log.Error("Got data while disconnected");break;case 'connected':while(true){if(this._flushing){break;}
if(!this._normal_msg()){break;}
if(this._sock.rQlen===0){break;}}
break;default:this._init_msg();break;}}
_handleKeyEvent(keysym,code,down){this.sendKey(keysym,code,down);}
_handleMouseButton(x,y,down,bmask){if(down){this._mouse_buttonMask|=bmask;}else{this._mouse_buttonMask&=~bmask;}
if(this.dragViewport){if(down&&!this._viewportDragging){this._viewportDragging=true;this._viewportDragPos={'x':x,'y':y};this._viewportHasMoved=false;return;}else{this._viewportDragging=false;if(this._viewportHasMoved){return;}
RFB.messages.pointerEvent(this._sock,this._display.absX(x),this._display.absY(y),bmask);}}
if(this._viewOnly){return;}
if(this._rfb_connection_state!=='connected'){return;}
RFB.messages.pointerEvent(this._sock,this._display.absX(x),this._display.absY(y),this._mouse_buttonMask);}
_handleMouseMove(x,y){if(this._viewportDragging){const deltaX=this._viewportDragPos.x-x;const deltaY=this._viewportDragPos.y-y;if(this._viewportHasMoved||(Math.abs(deltaX)>dragThreshold||Math.abs(deltaY)>dragThreshold)){this._viewportHasMoved=true;this._viewportDragPos={'x':x,'y':y};this._display.viewportChangePos(deltaX,deltaY);}
return;}
if(this._viewOnly){return;}
if(this._rfb_connection_state!=='connected'){return;}
RFB.messages.pointerEvent(this._sock,this._display.absX(x),this._display.absY(y),this._mouse_buttonMask);}
_negotiate_protocol_version(){if(this._sock.rQwait("version",12)){return false;}
const sversion=this._sock.rQshiftStr(12).substr(4,7);Log.Info("Server ProtocolVersion: "+sversion);let is_repeater=0;switch(sversion){case "000.000":is_repeater=1;break;case "003.003":case "003.006":case "003.889":this._rfb_version=3.3;break;case "003.007":this._rfb_version=3.7;break;case "003.008":case "004.000":case "004.001":case "005.000":this._rfb_version=3.8;break;default:return this._fail("Invalid server version "+sversion);}
if(is_repeater){let repeaterID="ID:"+this._repeaterID;while(repeaterID.length<250){repeaterID+="\0";}
this._sock.send_string(repeaterID);return true;}
if(this._rfb_version>this._rfb_max_version){this._rfb_version=this._rfb_max_version;}
const cversion="00"+parseInt(this._rfb_version,10)+
".00"+((this._rfb_version*10)%10);this._sock.send_string("RFB "+cversion+"\n");Log.Debug('Sent ProtocolVersion: '+cversion);this._rfb_init_state='Security';}
_negotiate_security(){function includes(item,array){for(let i=0;i<array.length;i++){if(array[i]===item){return true;}}
return false;}
if(this._rfb_version>=3.7){const num_types=this._sock.rQshift8();if(this._sock.rQwait("security type",num_types,1)){return false;}
if(num_types===0){this._rfb_init_state="SecurityReason";this._security_context="no security types";this._security_status=1;return this._init_msg();}
const types=this._sock.rQshiftBytes(num_types);Log.Debug("Server security types: "+types);if(includes(1,types)){this._rfb_auth_scheme=1;}else if(includes(22,types)){this._rfb_auth_scheme=22;}else if(includes(16,types)){this._rfb_auth_scheme=16;}else if(includes(2,types)){this._rfb_auth_scheme=2;}else if(includes(19,types)){this._rfb_auth_scheme=19;}else{return this._fail("Unsupported security types (types: "+types+")");}
this._sock.send([this._rfb_auth_scheme]);}else{if(this._sock.rQwait("security scheme",4)){return false;}
this._rfb_auth_scheme=this._sock.rQshift32();if(this._rfb_auth_scheme==0){this._rfb_init_state="SecurityReason";this._security_context="authentication scheme";this._security_status=1;return this._init_msg();}}
this._rfb_init_state='Authentication';Log.Debug('Authenticating using scheme: '+this._rfb_auth_scheme);return this._init_msg();}
_handle_security_reason(){if(this._sock.rQwait("reason length",4)){return false;}
const strlen=this._sock.rQshift32();let reason="";if(strlen>0){if(this._sock.rQwait("reason",strlen,4)){return false;}
reason=this._sock.rQshiftStr(strlen);}
if(reason!==""){this.dispatchEvent(new CustomEvent("securityfailure",{detail:{status:this._security_status,reason:reason}}));return this._fail("Security negotiation failed on "+
this._security_context+
" (reason: "+reason+")");}else{this.dispatchEvent(new CustomEvent("securityfailure",{detail:{status:this._security_status}}));return this._fail("Security negotiation failed on "+
this._security_context);}}
_negotiate_xvp_auth(){if(this._rfb_credentials.username===undefined||this._rfb_credentials.password===undefined||this._rfb_credentials.target===undefined){this.dispatchEvent(new CustomEvent("credentialsrequired",{detail:{types:["username","password","target"]}}));return false;}
const xvp_auth_str=String.fromCharCode(this._rfb_credentials.username.length)+
String.fromCharCode(this._rfb_credentials.target.length)+
this._rfb_credentials.username+
this._rfb_credentials.target;this._sock.send_string(xvp_auth_str);this._rfb_auth_scheme=2;return this._negotiate_authentication();}
_negotiate_vencrypt_auth(){if(this._rfb_vencrypt_state==0){if(this._sock.rQwait("vencrypt version",2)){return false;}
const major=this._sock.rQshift8();const minor=this._sock.rQshift8();if(!(major==0&&minor==2)){return this._fail("Unsupported VeNCrypt version "+major+"."+minor);}
this._sock.send([0,2]);this._rfb_vencrypt_state=1;}
if(this._rfb_vencrypt_state==1){if(this._sock.rQwait("vencrypt ack",1)){return false;}
const res=this._sock.rQshift8();if(res!=0){return this._fail("VeNCrypt failure "+res);}
this._rfb_vencrypt_state=2;}
if(this._rfb_vencrypt_state==2){if(this._sock.rQwait("vencrypt subtypes length",1)){return false;}
const subtypes_length=this._sock.rQshift8();if(subtypes_length<1){return this._fail("VeNCrypt subtypes empty");}
this._rfb_vencrypt_subtypes_length=subtypes_length;this._rfb_vencrypt_state=3;}
if(this._rfb_vencrypt_state==3){if(this._sock.rQwait("vencrypt subtypes",4*this._rfb_vencrypt_subtypes_length)){return false;}
const subtypes=[];for(let i=0;i<this._rfb_vencrypt_subtypes_length;i++){subtypes.push(this._sock.rQshift32());}
if(subtypes.indexOf(256)!=-1){this._sock.send([0,0,1,0]);this._rfb_vencrypt_state=4;}else{return this._fail("VeNCrypt Plain subtype not offered by server");}}
if(this._rfb_vencrypt_state==4){if(!this._rfb_credentials.username||!this._rfb_credentials.password){this.dispatchEvent(new CustomEvent("credentialsrequired",{detail:{types:["username","password"]}}));return false;}
const user=encodeUTF8(this._rfb_credentials.username);const pass=encodeUTF8(this._rfb_credentials.password);this._sock.send([0,0,0,user.length]);this._sock.send([0,0,0,pass.length]);this._sock.send_string(user);this._sock.send_string(pass);this._rfb_init_state="SecurityResult";return true;}}
_negotiate_std_vnc_auth(){if(this._sock.rQwait("auth challenge",16)){return false;}
if(this._rfb_credentials.password===undefined){this.dispatchEvent(new CustomEvent("credentialsrequired",{detail:{types:["password"]}}));return false;}
const challenge=Array.prototype.slice.call(this._sock.rQshiftBytes(16));const response=RFB.genDES(this._rfb_credentials.password,challenge);this._sock.send(response);this._rfb_init_state="SecurityResult";return true;}
_negotiate_tight_unix_auth(){if(this._rfb_credentials.username===undefined||this._rfb_credentials.password===undefined){this.dispatchEvent(new CustomEvent("credentialsrequired",{detail:{types:["username","password"]}}));return false;}
this._sock.send([0,0,0,this._rfb_credentials.username.length]);this._sock.send([0,0,0,this._rfb_credentials.password.length]);this._sock.send_string(this._rfb_credentials.username);this._sock.send_string(this._rfb_credentials.password);this._rfb_init_state="SecurityResult";return true;}
_negotiate_tight_tunnels(numTunnels){const clientSupportedTunnelTypes={0:{vendor:'TGHT',signature:'NOTUNNEL'}};const serverSupportedTunnelTypes={};for(let i=0;i<numTunnels;i++){const cap_code=this._sock.rQshift32();const cap_vendor=this._sock.rQshiftStr(4);const cap_signature=this._sock.rQshiftStr(8);serverSupportedTunnelTypes[cap_code]={vendor:cap_vendor,signature:cap_signature};}
Log.Debug("Server Tight tunnel types: "+serverSupportedTunnelTypes);if(serverSupportedTunnelTypes[1]&&(serverSupportedTunnelTypes[1].vendor==="SICR")&&(serverSupportedTunnelTypes[1].signature==="SCHANNEL")){Log.Debug("Detected Siemens server. Assuming NOTUNNEL support.");serverSupportedTunnelTypes[0]={vendor:'TGHT',signature:'NOTUNNEL'};}
if(serverSupportedTunnelTypes[0]){if(serverSupportedTunnelTypes[0].vendor!=clientSupportedTunnelTypes[0].vendor||serverSupportedTunnelTypes[0].signature!=clientSupportedTunnelTypes[0].signature){return this._fail("Client's tunnel type had the incorrect "+
"vendor or signature");}
Log.Debug("Selected tunnel type: "+clientSupportedTunnelTypes[0]);this._sock.send([0,0,0,0]);return false;}else{return this._fail("Server wanted tunnels, but doesn't support "+
"the notunnel type");}}
_negotiate_tight_auth(){if(!this._rfb_tightvnc){if(this._sock.rQwait("num tunnels",4)){return false;}
const numTunnels=this._sock.rQshift32();if(numTunnels>0&&this._sock.rQwait("tunnel capabilities",16*numTunnels,4)){return false;}
this._rfb_tightvnc=true;if(numTunnels>0){this._negotiate_tight_tunnels(numTunnels);return false;}}
if(this._sock.rQwait("sub auth count",4)){return false;}
const subAuthCount=this._sock.rQshift32();if(subAuthCount===0){this._rfb_init_state='SecurityResult';return true;}
if(this._sock.rQwait("sub auth capabilities",16*subAuthCount,4)){return false;}
const clientSupportedTypes={'STDVNOAUTH__':1,'STDVVNCAUTH_':2,'TGHTULGNAUTH':129};const serverSupportedTypes=[];for(let i=0;i<subAuthCount;i++){this._sock.rQshift32();const capabilities=this._sock.rQshiftStr(12);serverSupportedTypes.push(capabilities);}
Log.Debug("Server Tight authentication types: "+serverSupportedTypes);for(let authType in clientSupportedTypes){if(serverSupportedTypes.indexOf(authType)!=-1){this._sock.send([0,0,0,clientSupportedTypes[authType]]);Log.Debug("Selected authentication type: "+authType);switch(authType){case 'STDVNOAUTH__':this._rfb_init_state='SecurityResult';return true;case 'STDVVNCAUTH_':this._rfb_auth_scheme=2;return this._init_msg();case 'TGHTULGNAUTH':this._rfb_auth_scheme=129;return this._init_msg();default:return this._fail("Unsupported tiny auth scheme "+
"(scheme: "+authType+")");}}}
return this._fail("No supported sub-auth types!");}
_negotiate_authentication(){switch(this._rfb_auth_scheme){case 1:if(this._rfb_version>=3.8){this._rfb_init_state='SecurityResult';return true;}
this._rfb_init_state='ClientInitialisation';return this._init_msg();case 22:return this._negotiate_xvp_auth();case 2:return this._negotiate_std_vnc_auth();case 16:return this._negotiate_tight_auth();case 19:return this._negotiate_vencrypt_auth();case 129:return this._negotiate_tight_unix_auth();default:return this._fail("Unsupported auth scheme (scheme: "+
this._rfb_auth_scheme+")");}}
_handle_security_result(){if(this._sock.rQwait('VNC auth response ',4)){return false;}
const status=this._sock.rQshift32();if(status===0){this._rfb_init_state='ClientInitialisation';Log.Debug('Authentication OK');return this._init_msg();}else{if(this._rfb_version>=3.8){this._rfb_init_state="SecurityReason";this._security_context="security result";this._security_status=status;return this._init_msg();}else{this.dispatchEvent(new CustomEvent("securityfailure",{detail:{status:status}}));return this._fail("Security handshake failed");}}}
_negotiate_server_init(){if(this._sock.rQwait("server initialization",24)){return false;}
const width=this._sock.rQshift16();const height=this._sock.rQshift16();const bpp=this._sock.rQshift8();const depth=this._sock.rQshift8();const big_endian=this._sock.rQshift8();const true_color=this._sock.rQshift8();const red_max=this._sock.rQshift16();const green_max=this._sock.rQshift16();const blue_max=this._sock.rQshift16();const red_shift=this._sock.rQshift8();const green_shift=this._sock.rQshift8();const blue_shift=this._sock.rQshift8();this._sock.rQskipBytes(3);const name_length=this._sock.rQshift32();if(this._sock.rQwait('server init name',name_length,24)){return false;}
let name=this._sock.rQshiftStr(name_length);name=decodeUTF8(name,true);if(this._rfb_tightvnc){if(this._sock.rQwait('TightVNC extended server init header',8,24+name_length)){return false;}
const numServerMessages=this._sock.rQshift16();const numClientMessages=this._sock.rQshift16();const numEncodings=this._sock.rQshift16();this._sock.rQskipBytes(2);const totalMessagesLength=(numServerMessages+numClientMessages+numEncodings)*16;if(this._sock.rQwait('TightVNC extended server init header',totalMessagesLength,32+name_length)){return false;}
this._sock.rQskipBytes(16*numServerMessages);this._sock.rQskipBytes(16*numClientMessages);this._sock.rQskipBytes(16*numEncodings);}
Log.Info("Screen: "+width+"x"+height+
", bpp: "+bpp+", depth: "+depth+
", big_endian: "+big_endian+
", true_color: "+true_color+
", red_max: "+red_max+
", green_max: "+green_max+
", blue_max: "+blue_max+
", red_shift: "+red_shift+
", green_shift: "+green_shift+
", blue_shift: "+blue_shift);this._setDesktopName(name);this._resize(width,height);if(!this._viewOnly){this._keyboard.grab();}
if(!this._viewOnly){this._mouse.grab();}
this._fb_depth=24;if(this._fb_name==="Intel(r) AMT KVM"){Log.Warn("Intel AMT KVM only supports 8/16 bit depths. Using low color mode.");this._fb_depth=8;}
RFB.messages.pixelFormat(this._sock,this._fb_depth,true);this._sendEncodings();RFB.messages.fbUpdateRequest(this._sock,false,0,0,this._fb_width,this._fb_height);this._updateConnectionState('connected');return true;}
_sendEncodings(){const encs=[];encs.push(encodings.encodingCopyRect);if(this._fb_depth==24){encs.push(encodings.encodingTight);encs.push(encodings.encodingTightPNG);encs.push(encodings.encodingHextile);encs.push(encodings.encodingRRE);}
encs.push(encodings.encodingRaw);encs.push(encodings.pseudoEncodingQualityLevel0+this._qualityLevel);encs.push(encodings.pseudoEncodingCompressLevel0+2);encs.push(encodings.pseudoEncodingDesktopSize);encs.push(encodings.pseudoEncodingLastRect);encs.push(encodings.pseudoEncodingQEMUExtendedKeyEvent);encs.push(encodings.pseudoEncodingExtendedDesktopSize);encs.push(encodings.pseudoEncodingXvp);encs.push(encodings.pseudoEncodingFence);encs.push(encodings.pseudoEncodingContinuousUpdates);encs.push(encodings.pseudoEncodingDesktopName);encs.push(encodings.pseudoEncodingExtendedClipboard);if(this._fb_depth==24){encs.push(encodings.pseudoEncodingVMwareCursor);encs.push(encodings.pseudoEncodingCursor);}
RFB.messages.clientEncodings(this._sock,encs);}
_init_msg(){switch(this._rfb_init_state){case 'ProtocolVersion':return this._negotiate_protocol_version();case 'Security':return this._negotiate_security();case 'Authentication':return this._negotiate_authentication();case 'SecurityResult':return this._handle_security_result();case 'SecurityReason':return this._handle_security_reason();case 'ClientInitialisation':this._sock.send([this._shared?1:0]);this._rfb_init_state='ServerInitialisation';return true;case 'ServerInitialisation':return this._negotiate_server_init();default:return this._fail("Unknown init state (state: "+
this._rfb_init_state+")");}}
_handle_set_colour_map_msg(){Log.Debug("SetColorMapEntries");return this._fail("Unexpected SetColorMapEntries message");}
_handle_server_cut_text(){Log.Debug("ServerCutText");if(this._sock.rQwait("ServerCutText header",7,1)){return false;}
this._sock.rQskipBytes(3);let length=this._sock.rQshift32();length=toSigned32bit(length);if(this._sock.rQwait("ServerCutText content",Math.abs(length),8)){return false;}
if(length>=0){const text=this._sock.rQshiftStr(length);if(this._viewOnly){return true;}
this.dispatchEvent(new CustomEvent("clipboard",{detail:{text:text}}));}else{length=Math.abs(length);const flags=this._sock.rQshift32();let formats=flags&0x0000FFFF;let actions=flags&0xFF000000;let isCaps=(!!(actions&extendedClipboardActionCaps));if(isCaps){this._clipboardServerCapabilitiesFormats={};this._clipboardServerCapabilitiesActions={};for(let i=0;i<=15;i++){let index=1<<i;if((formats&index)){this._clipboardServerCapabilitiesFormats[index]=true;this._sock.rQshift32();}}
for(let i=24;i<=31;i++){let index=1<<i;this._clipboardServerCapabilitiesActions[index]=!!(actions&index);}
let clientActions=[extendedClipboardActionCaps,extendedClipboardActionRequest,extendedClipboardActionPeek,extendedClipboardActionNotify,extendedClipboardActionProvide];RFB.messages.extendedClipboardCaps(this._sock,clientActions,{extendedClipboardFormatText:0});}else if(actions===extendedClipboardActionRequest){if(this._viewOnly){return true;}
if(this._clipboardText!=null&&this._clipboardServerCapabilitiesActions[extendedClipboardActionProvide]){if(formats&extendedClipboardFormatText){RFB.messages.extendedClipboardProvide(this._sock,[extendedClipboardFormatText],[this._clipboardText]);}}}else if(actions===extendedClipboardActionPeek){if(this._viewOnly){return true;}
if(this._clipboardServerCapabilitiesActions[extendedClipboardActionNotify]){if(this._clipboardText!=null){RFB.messages.extendedClipboardNotify(this._sock,[extendedClipboardFormatText]);}else{RFB.messages.extendedClipboardNotify(this._sock,[]);}}}else if(actions===extendedClipboardActionNotify){if(this._viewOnly){return true;}
if(this._clipboardServerCapabilitiesActions[extendedClipboardActionRequest]){if(formats&extendedClipboardFormatText){RFB.messages.extendedClipboardRequest(this._sock,[extendedClipboardFormatText]);}}}else if(actions===extendedClipboardActionProvide){if(this._viewOnly){return true;}
if(!(formats&extendedClipboardFormatText)){return true;}
this._clipboardText=null;let zlibStream=this._sock.rQshiftBytes(length-4);let streamInflator=new Inflator();let textData=null;streamInflator.setInput(zlibStream);for(let i=0;i<=15;i++){let format=1<<i;if(formats&format){let size=0x00;let sizeArray=streamInflator.inflate(4);size|=(sizeArray[0]<<24);size|=(sizeArray[1]<<16);size|=(sizeArray[2]<<8);size|=(sizeArray[3]);let chunk=streamInflator.inflate(size);if(format===extendedClipboardFormatText){textData=chunk;}}}
streamInflator.setInput(null);if(textData!==null){let tmpText="";for(let i=0;i<textData.length;i++){tmpText+=String.fromCharCode(textData[i]);}
textData=tmpText;textData=decodeUTF8(textData);if((textData.length>0)&&"\0"===textData.charAt(textData.length-1)){textData=textData.slice(0,-1);}
textData=textData.replace("\r\n","\n");this.dispatchEvent(new CustomEvent("clipboard",{detail:{text:textData}}));}}else{return this._fail("Unexpected action in extended clipboard message: "+actions);}}
return true;}
_handle_server_fence_msg(){if(this._sock.rQwait("ServerFence header",8,1)){return false;}
this._sock.rQskipBytes(3);let flags=this._sock.rQshift32();let length=this._sock.rQshift8();if(this._sock.rQwait("ServerFence payload",length,9)){return false;}
if(length>64){Log.Warn("Bad payload length ("+length+") in fence response");length=64;}
const payload=this._sock.rQshiftStr(length);this._supportsFence=true;if(!(flags&(1<<31))){return this._fail("Unexpected fence response");}
flags&=(1<<0)|(1<<1);RFB.messages.clientFence(this._sock,flags,payload);return true;}
_handle_xvp_msg(){if(this._sock.rQwait("XVP version and message",3,1)){return false;}
this._sock.rQskipBytes(1);const xvp_ver=this._sock.rQshift8();const xvp_msg=this._sock.rQshift8();switch(xvp_msg){case 0:Log.Error("XVP Operation Failed");break;case 1:this._rfb_xvp_ver=xvp_ver;Log.Info("XVP extensions enabled (version "+this._rfb_xvp_ver+")");this._setCapability("power",true);break;default:this._fail("Illegal server XVP message (msg: "+xvp_msg+")");break;}
return true;}
_normal_msg(){let msg_type;if(this._FBU.rects>0){msg_type=0;}else{msg_type=this._sock.rQshift8();}
let first,ret;switch(msg_type){case 0:ret=this._framebufferUpdate();if(ret&&!this._enabledContinuousUpdates){RFB.messages.fbUpdateRequest(this._sock,true,0,0,this._fb_width,this._fb_height);}
return ret;case 1:return this._handle_set_colour_map_msg();case 2:Log.Debug("Bell");this.dispatchEvent(new CustomEvent("bell",{detail:{}}));return true;case 3:return this._handle_server_cut_text();case 150:first=!this._supportsContinuousUpdates;this._supportsContinuousUpdates=true;this._enabledContinuousUpdates=false;if(first){this._enabledContinuousUpdates=true;this._updateContinuousUpdates();Log.Info("Enabling continuous updates.");}else{}
return true;case 248:return this._handle_server_fence_msg();case 250:return this._handle_xvp_msg();default:this._fail("Unexpected server message (type "+msg_type+")");Log.Debug("sock.rQslice(0, 30): "+this._sock.rQslice(0,30));return true;}}
_onFlush(){this._flushing=false;if(this._sock.rQlen>0){this._handle_message();}}
_framebufferUpdate(){if(this._FBU.rects===0){if(this._sock.rQwait("FBU header",3,1)){return false;}
this._sock.rQskipBytes(1);this._FBU.rects=this._sock.rQshift16();if(this._display.pending()){this._flushing=true;this._display.flush();return false;}}
while(this._FBU.rects>0){if(this._FBU.encoding===null){if(this._sock.rQwait("rect header",12)){return false;}
const hdr=this._sock.rQshiftBytes(12);this._FBU.x=(hdr[0]<<8)+hdr[1];this._FBU.y=(hdr[2]<<8)+hdr[3];this._FBU.width=(hdr[4]<<8)+hdr[5];this._FBU.height=(hdr[6]<<8)+hdr[7];this._FBU.encoding=parseInt((hdr[8]<<24)+(hdr[9]<<16)+
(hdr[10]<<8)+hdr[11],10);}
if(!this._handleRect()){return false;}
this._FBU.rects--;this._FBU.encoding=null;}
this._display.flip();return true;}
_handleRect(){switch(this._FBU.encoding){case encodings.pseudoEncodingLastRect:this._FBU.rects=1;return true;case encodings.pseudoEncodingVMwareCursor:return this._handleVMwareCursor();case encodings.pseudoEncodingCursor:return this._handleCursor();case encodings.pseudoEncodingQEMUExtendedKeyEvent:try{const keyboardEvent=document.createEvent("keyboardEvent");if(keyboardEvent.code!==undefined){this._qemuExtKeyEventSupported=true;}}catch(err){}
return true;case encodings.pseudoEncodingDesktopName:return this._handleDesktopName();case encodings.pseudoEncodingDesktopSize:this._resize(this._FBU.width,this._FBU.height);return true;case encodings.pseudoEncodingExtendedDesktopSize:return this._handleExtendedDesktopSize();default:return this._handleDataRect();}}
_handleVMwareCursor(){const hotx=this._FBU.x;const hoty=this._FBU.y;const w=this._FBU.width;const h=this._FBU.height;if(this._sock.rQwait("VMware cursor encoding",1)){return false;}
const cursor_type=this._sock.rQshift8();this._sock.rQshift8();let rgba;const bytesPerPixel=4;if(cursor_type==0){const PIXEL_MASK=0xffffff00|0;rgba=new Array(w*h*bytesPerPixel);if(this._sock.rQwait("VMware cursor classic encoding",(w*h*bytesPerPixel)*2,2)){return false;}
let and_mask=new Array(w*h);for(let pixel=0;pixel<(w*h);pixel++){and_mask[pixel]=this._sock.rQshift32();}
let xor_mask=new Array(w*h);for(let pixel=0;pixel<(w*h);pixel++){xor_mask[pixel]=this._sock.rQshift32();}
for(let pixel=0;pixel<(w*h);pixel++){if(and_mask[pixel]==0){let bgr=xor_mask[pixel];let r=bgr>>8&0xff;let g=bgr>>16&0xff;let b=bgr>>24&0xff;rgba[(pixel*bytesPerPixel)]=r;rgba[(pixel*bytesPerPixel)+1]=g;rgba[(pixel*bytesPerPixel)+2]=b;rgba[(pixel*bytesPerPixel)+3]=0xff;}else if((and_mask[pixel]&PIXEL_MASK)==PIXEL_MASK){if(xor_mask[pixel]==0){rgba[(pixel*bytesPerPixel)]=0x00;rgba[(pixel*bytesPerPixel)+1]=0x00;rgba[(pixel*bytesPerPixel)+2]=0x00;rgba[(pixel*bytesPerPixel)+3]=0x00;}else if((xor_mask[pixel]&PIXEL_MASK)==PIXEL_MASK){rgba[(pixel*bytesPerPixel)]=0x00;rgba[(pixel*bytesPerPixel)+1]=0x00;rgba[(pixel*bytesPerPixel)+2]=0x00;rgba[(pixel*bytesPerPixel)+3]=0xff;}else{rgba[(pixel*bytesPerPixel)]=0x00;rgba[(pixel*bytesPerPixel)+1]=0x00;rgba[(pixel*bytesPerPixel)+2]=0x00;rgba[(pixel*bytesPerPixel)+3]=0xff;}}else{rgba[(pixel*bytesPerPixel)]=0x00;rgba[(pixel*bytesPerPixel)+1]=0x00;rgba[(pixel*bytesPerPixel)+2]=0x00;rgba[(pixel*bytesPerPixel)+3]=0xff;}}}else if(cursor_type==1){if(this._sock.rQwait("VMware cursor alpha encoding",(w*h*4),2)){return false;}
rgba=new Array(w*h*bytesPerPixel);for(let pixel=0;pixel<(w*h);pixel++){let data=this._sock.rQshift32();rgba[(pixel*4)]=data>>24&0xff;rgba[(pixel*4)+1]=data>>16&0xff;rgba[(pixel*4)+2]=data>>8&0xff;rgba[(pixel*4)+3]=data&0xff;}}else{Log.Warn("The given cursor type is not supported: "
+cursor_type+" given.");return false;}
this._updateCursor(rgba,hotx,hoty,w,h);return true;}
_handleCursor(){const hotx=this._FBU.x;const hoty=this._FBU.y;const w=this._FBU.width;const h=this._FBU.height;const pixelslength=w*h*4;const masklength=Math.ceil(w/8)*h;let bytes=pixelslength+masklength;if(this._sock.rQwait("cursor encoding",bytes)){return false;}
const pixels=this._sock.rQshiftBytes(pixelslength);const mask=this._sock.rQshiftBytes(masklength);let rgba=new Uint8Array(w*h*4);let pix_idx=0;for(let y=0;y<h;y++){for(let x=0;x<w;x++){let mask_idx=y*Math.ceil(w/8)+Math.floor(x/8);let alpha=(mask[mask_idx]<<(x%8))&0x80?255:0;rgba[pix_idx]=pixels[pix_idx+2];rgba[pix_idx+1]=pixels[pix_idx+1];rgba[pix_idx+2]=pixels[pix_idx];rgba[pix_idx+3]=alpha;pix_idx+=4;}}
this._updateCursor(rgba,hotx,hoty,w,h);return true;}
_handleDesktopName(){if(this._sock.rQwait("DesktopName",4)){return false;}
let length=this._sock.rQshift32();if(this._sock.rQwait("DesktopName",length,4)){return false;}
let name=this._sock.rQshiftStr(length);name=decodeUTF8(name,true);this._setDesktopName(name);return true;}
_handleExtendedDesktopSize(){if(this._sock.rQwait("ExtendedDesktopSize",4)){return false;}
const number_of_screens=this._sock.rQpeek8();let bytes=4+(number_of_screens*16);if(this._sock.rQwait("ExtendedDesktopSize",bytes)){return false;}
const firstUpdate=!this._supportsSetDesktopSize;this._supportsSetDesktopSize=true;if(firstUpdate){this._requestRemoteResize();}
this._sock.rQskipBytes(1);this._sock.rQskipBytes(3);for(let i=0;i<number_of_screens;i+=1){if(i===0){this._screen_id=this._sock.rQshiftBytes(4);this._sock.rQskipBytes(2);this._sock.rQskipBytes(2);this._sock.rQskipBytes(2);this._sock.rQskipBytes(2);this._screen_flags=this._sock.rQshiftBytes(4);}else{this._sock.rQskipBytes(16);}}
if(this._FBU.x===1&&this._FBU.y!==0){let msg="";switch(this._FBU.y){case 1:msg="Resize is administratively prohibited";break;case 2:msg="Out of resources";break;case 3:msg="Invalid screen layout";break;default:msg="Unknown reason";break;}
Log.Warn("Server did not accept the resize request: "
+msg);}else{this._resize(this._FBU.width,this._FBU.height);}
return true;}
_handleDataRect(){let decoder=this._decoders[this._FBU.encoding];if(!decoder){this._fail("Unsupported encoding (encoding: "+
this._FBU.encoding+")");return false;}
try{return decoder.decodeRect(this._FBU.x,this._FBU.y,this._FBU.width,this._FBU.height,this._sock,this._display,this._fb_depth);}catch(err){this._fail("Error decoding rect: "+err);return false;}}
_updateContinuousUpdates(){if(!this._enabledContinuousUpdates){return;}
RFB.messages.enableContinuousUpdates(this._sock,true,0,0,this._fb_width,this._fb_height);}
_resize(width,height){this._fb_width=width;this._fb_height=height;this._display.resize(this._fb_width,this._fb_height);this._updateClip();this._updateScale();this._updateContinuousUpdates();}
_xvpOp(ver,op){if(this._rfb_xvp_ver<ver){return;}
Log.Info("Sending XVP operation "+op+" (version "+ver+")");RFB.messages.xvpOp(this._sock,ver,op);}
_updateCursor(rgba,hotx,hoty,w,h){this._cursorImage={rgbaPixels:rgba,hotx:hotx,hoty:hoty,w:w,h:h,};this._refreshCursor();}
_shouldShowDotCursor(){if(!this._showDotCursor){return false;}
for(let i=3;i<this._cursorImage.rgbaPixels.length;i+=4){if(this._cursorImage.rgbaPixels[i]){return false;}}
return true;}
_refreshCursor(){if(this._rfb_connection_state!=="connecting"&&this._rfb_connection_state!=="connected"){return;}
const image=this._shouldShowDotCursor()?RFB.cursors.dot:this._cursorImage;this._cursor.change(image.rgbaPixels,image.hotx,image.hoty,image.w,image.h);}
static genDES(password,challenge){const passwordChars=password.split('').map(c=>c.charCodeAt(0));return(new DES(passwordChars)).encrypt(challenge);}}
RFB.messages={keyEvent(sock,keysym,down){const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=4;buff[offset+1]=down;buff[offset+2]=0;buff[offset+3]=0;buff[offset+4]=(keysym>>24);buff[offset+5]=(keysym>>16);buff[offset+6]=(keysym>>8);buff[offset+7]=keysym;sock._sQlen+=8;sock.flush();},QEMUExtendedKeyEvent(sock,keysym,down,keycode){function getRFBkeycode(xt_scancode){const upperByte=(keycode>>8);const lowerByte=(keycode&0x00ff);if(upperByte===0xe0&&lowerByte<0x7f){return lowerByte|0x80;}
return xt_scancode;}
const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=255;buff[offset+1]=0;buff[offset+2]=(down>>8);buff[offset+3]=down;buff[offset+4]=(keysym>>24);buff[offset+5]=(keysym>>16);buff[offset+6]=(keysym>>8);buff[offset+7]=keysym;const RFBkeycode=getRFBkeycode(keycode);buff[offset+8]=(RFBkeycode>>24);buff[offset+9]=(RFBkeycode>>16);buff[offset+10]=(RFBkeycode>>8);buff[offset+11]=RFBkeycode;sock._sQlen+=12;sock.flush();},pointerEvent(sock,x,y,mask){const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=5;buff[offset+1]=mask;buff[offset+2]=x>>8;buff[offset+3]=x;buff[offset+4]=y>>8;buff[offset+5]=y;sock._sQlen+=6;sock.flush();},_buildExtendedClipboardFlags(actions,formats){let data=new Uint8Array(4);let formatFlag=0x00000000;let actionFlag=0x00000000;for(let i=0;i<actions.length;i++){actionFlag|=actions[i];}
for(let i=0;i<formats.length;i++){formatFlag|=formats[i];}
data[0]=actionFlag>>24;data[1]=0x00;data[2]=0x00;data[3]=formatFlag;return data;},extendedClipboardProvide(sock,formats,inData){let deflator=new Deflator();let dataToDeflate=[];for(let i=0;i<formats.length;i++){if(formats[i]!=extendedClipboardFormatText){throw new Error("Unsupported extended clipboard format for Provide message.");}
inData[i]=inData[i].replace(/\r\n|\r|\n/gm,"\r\n");let text=encodeUTF8(inData[i]+"\0");dataToDeflate.push((text.length>>24)&0xFF,(text.length>>16)&0xFF,(text.length>>8)&0xFF,(text.length&0xFF));for(let j=0;j<text.length;j++){dataToDeflate.push(text.charCodeAt(j));}}
let deflatedData=deflator.deflate(new Uint8Array(dataToDeflate));let data=new Uint8Array(4+deflatedData.length);data.set(RFB.messages._buildExtendedClipboardFlags([extendedClipboardActionProvide],formats));data.set(deflatedData,4);RFB.messages.clientCutText(sock,data,true);},extendedClipboardNotify(sock,formats){let flags=RFB.messages._buildExtendedClipboardFlags([extendedClipboardActionNotify],formats);RFB.messages.clientCutText(sock,flags,true);},extendedClipboardRequest(sock,formats){let flags=RFB.messages._buildExtendedClipboardFlags([extendedClipboardActionRequest],formats);RFB.messages.clientCutText(sock,flags,true);},extendedClipboardCaps(sock,actions,formats){let formatKeys=Object.keys(formats);let data=new Uint8Array(4+(4*formatKeys.length));formatKeys.map(x=>parseInt(x));formatKeys.sort((a,b)=>a-b);data.set(RFB.messages._buildExtendedClipboardFlags(actions,[]));let loopOffset=4;for(let i=0;i<formatKeys.length;i++){data[loopOffset]=formats[formatKeys[i]]>>24;data[loopOffset+1]=formats[formatKeys[i]]>>16;data[loopOffset+2]=formats[formatKeys[i]]>>8;data[loopOffset+3]=formats[formatKeys[i]]>>0;loopOffset+=4;data[3]|=(1<<formatKeys[i]);}
RFB.messages.clientCutText(sock,data,true);},clientCutText(sock,data,extended=false){const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=6;buff[offset+1]=0;buff[offset+2]=0;buff[offset+3]=0;let length;if(extended){length=toUnsigned32bit(-data.length);}else{length=data.length;}
buff[offset+4]=length>>24;buff[offset+5]=length>>16;buff[offset+6]=length>>8;buff[offset+7]=length;sock._sQlen+=8;let dataOffset=0;let remaining=data.length;while(remaining>0){let flushSize=Math.min(remaining,(sock._sQbufferSize-sock._sQlen));for(let i=0;i<flushSize;i++){buff[sock._sQlen+i]=data[dataOffset+i];}
sock._sQlen+=flushSize;sock.flush();remaining-=flushSize;dataOffset+=flushSize;}},setDesktopSize(sock,width,height,id,flags){const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=251;buff[offset+1]=0;buff[offset+2]=width>>8;buff[offset+3]=width;buff[offset+4]=height>>8;buff[offset+5]=height;buff[offset+6]=1;buff[offset+7]=0;buff[offset+8]=id>>24;buff[offset+9]=id>>16;buff[offset+10]=id>>8;buff[offset+11]=id;buff[offset+12]=0;buff[offset+13]=0;buff[offset+14]=0;buff[offset+15]=0;buff[offset+16]=width>>8;buff[offset+17]=width;buff[offset+18]=height>>8;buff[offset+19]=height;buff[offset+20]=flags>>24;buff[offset+21]=flags>>16;buff[offset+22]=flags>>8;buff[offset+23]=flags;sock._sQlen+=24;sock.flush();},clientFence(sock,flags,payload){const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=248;buff[offset+1]=0;buff[offset+2]=0;buff[offset+3]=0;buff[offset+4]=flags>>24;buff[offset+5]=flags>>16;buff[offset+6]=flags>>8;buff[offset+7]=flags;const n=payload.length;buff[offset+8]=n;for(let i=0;i<n;i++){buff[offset+9+i]=payload.charCodeAt(i);}
sock._sQlen+=9+n;sock.flush();},enableContinuousUpdates(sock,enable,x,y,width,height){const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=150;buff[offset+1]=enable;buff[offset+2]=x>>8;buff[offset+3]=x;buff[offset+4]=y>>8;buff[offset+5]=y;buff[offset+6]=width>>8;buff[offset+7]=width;buff[offset+8]=height>>8;buff[offset+9]=height;sock._sQlen+=10;sock.flush();},pixelFormat(sock,depth,true_color){const buff=sock._sQ;const offset=sock._sQlen;let bpp;if(depth>16){bpp=32;}else if(depth>8){bpp=16;}else{bpp=8;}
const bits=Math.floor(depth/3);buff[offset]=0;buff[offset+1]=0;buff[offset+2]=0;buff[offset+3]=0;buff[offset+4]=bpp;buff[offset+5]=depth;buff[offset+6]=0;buff[offset+7]=true_color?1:0;buff[offset+8]=0;buff[offset+9]=(1<<bits)-1;buff[offset+10]=0;buff[offset+11]=(1<<bits)-1;buff[offset+12]=0;buff[offset+13]=(1<<bits)-1;buff[offset+14]=bits*2;buff[offset+15]=bits*1;buff[offset+16]=bits*0;buff[offset+17]=0;buff[offset+18]=0;buff[offset+19]=0;sock._sQlen+=20;sock.flush();},clientEncodings(sock,encodings){const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=2;buff[offset+1]=0;buff[offset+2]=encodings.length>>8;buff[offset+3]=encodings.length;let j=offset+4;for(let i=0;i<encodings.length;i++){const enc=encodings[i];buff[j]=enc>>24;buff[j+1]=enc>>16;buff[j+2]=enc>>8;buff[j+3]=enc;j+=4;}
sock._sQlen+=j-offset;sock.flush();},fbUpdateRequest(sock,incremental,x,y,w,h){const buff=sock._sQ;const offset=sock._sQlen;if(typeof(x)==="undefined"){x=0;}
if(typeof(y)==="undefined"){y=0;}
buff[offset]=3;buff[offset+1]=incremental?1:0;buff[offset+2]=(x>>8)&0xFF;buff[offset+3]=x&0xFF;buff[offset+4]=(y>>8)&0xFF;buff[offset+5]=y&0xFF;buff[offset+6]=(w>>8)&0xFF;buff[offset+7]=w&0xFF;buff[offset+8]=(h>>8)&0xFF;buff[offset+9]=h&0xFF;sock._sQlen+=10;sock.flush();},xvpOp(sock,ver,op){const buff=sock._sQ;const offset=sock._sQlen;buff[offset]=250;buff[offset+1]=0;buff[offset+2]=ver;buff[offset+3]=op;sock._sQlen+=4;sock.flush();}};RFB.cursors={none:{rgbaPixels:new Uint8Array(),w:0,h:0,hotx:0,hoty:0,},dot:{rgbaPixels:new Uint8Array([255,255,255,255,0,0,0,255,255,255,255,255,0,0,0,255,0,0,0,0,0,0,0,255,255,255,255,255,0,0,0,255,255,255,255,255,]),w:3,h:3,hotx:1,hoty:1,}};