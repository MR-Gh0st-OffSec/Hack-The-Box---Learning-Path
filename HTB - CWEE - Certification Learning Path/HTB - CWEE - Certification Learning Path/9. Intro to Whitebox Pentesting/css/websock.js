import*as Log from './util/logging.js';const ENABLE_COPYWITHIN=false;const MAX_RQ_GROW_SIZE=40*1024*1024;export default class Websock{constructor(){this._websocket=null;this._rQi=0;this._rQlen=0;this._rQbufferSize=1024*1024*4;this._rQ=null;this._sQbufferSize=1024*10;this._sQlen=0;this._sQ=null;this._eventHandlers={message:()=>{},open:()=>{},close:()=>{},error:()=>{}};}
get sQ(){return this._sQ;}
get rQ(){return this._rQ;}
get rQi(){return this._rQi;}
set rQi(val){this._rQi=val;}
get rQlen(){return this._rQlen-this._rQi;}
rQpeek8(){return this._rQ[this._rQi];}
rQskipBytes(bytes){this._rQi+=bytes;}
rQshift8(){return this._rQshift(1);}
rQshift16(){return this._rQshift(2);}
rQshift32(){return this._rQshift(4);}
_rQshift(bytes){let res=0;for(let byte=bytes-1;byte>=0;byte--){res+=this._rQ[this._rQi++]<<(byte*8);}
return res;}
rQshiftStr(len){if(typeof(len)==='undefined'){len=this.rQlen;}
let str="";for(let i=0;i<len;i+=4096){let part=this.rQshiftBytes(Math.min(4096,len-i));str+=String.fromCharCode.apply(null,part);}
return str;}
rQshiftBytes(len){if(typeof(len)==='undefined'){len=this.rQlen;}
this._rQi+=len;return new Uint8Array(this._rQ.buffer,this._rQi-len,len);}
rQshiftTo(target,len){if(len===undefined){len=this.rQlen;}
target.set(new Uint8Array(this._rQ.buffer,this._rQi,len));this._rQi+=len;}
rQslice(start,end=this.rQlen){return new Uint8Array(this._rQ.buffer,this._rQi+start,end-start);}
rQwait(msg,num,goback){if(this.rQlen<num){if(goback){if(this._rQi<goback){throw new Error("rQwait cannot backup "+goback+" bytes");}
this._rQi-=goback;}
return true;}
return false;}
flush(){if(this._sQlen>0&&this._websocket.readyState===WebSocket.OPEN){this._websocket.send(this._encode_message());this._sQlen=0;}}
send(arr){this._sQ.set(arr,this._sQlen);this._sQlen+=arr.length;this.flush();}
send_string(str){this.send(str.split('').map(chr=>chr.charCodeAt(0)));}
off(evt){this._eventHandlers[evt]=()=>{};}
on(evt,handler){this._eventHandlers[evt]=handler;}
_allocate_buffers(){this._rQ=new Uint8Array(this._rQbufferSize);this._sQ=new Uint8Array(this._sQbufferSize);}
init(){this._allocate_buffers();this._rQi=0;this._websocket=null;}
open(uri,protocols){this.init();this._websocket=new WebSocket(uri,protocols);this._websocket.binaryType='arraybuffer';this._websocket.onmessage=this._recv_message.bind(this);this._websocket.onopen=()=>{Log.Debug('>> WebSock.onopen');if(this._websocket.protocol){Log.Info("Server choose sub-protocol: "+this._websocket.protocol);}
this._eventHandlers.open();Log.Debug("<< WebSock.onopen");};this._websocket.onclose=(e)=>{Log.Debug(">> WebSock.onclose");this._eventHandlers.close(e);Log.Debug("<< WebSock.onclose");};this._websocket.onerror=(e)=>{Log.Debug(">> WebSock.onerror: "+e);this._eventHandlers.error(e);Log.Debug("<< WebSock.onerror: "+e);};}
close(){if(this._websocket){if((this._websocket.readyState===WebSocket.OPEN)||(this._websocket.readyState===WebSocket.CONNECTING)){Log.Info("Closing WebSocket connection");this._websocket.close();}
this._websocket.onmessage=()=>{};}}
_encode_message(){return new Uint8Array(this._sQ.buffer,0,this._sQlen);}
_expand_compact_rQ(min_fit){const required_buffer_size=(this._rQlen-this._rQi+min_fit)*8;const resizeNeeded=this._rQbufferSize<required_buffer_size;if(resizeNeeded){this._rQbufferSize=Math.max(this._rQbufferSize*2,required_buffer_size);}
if(this._rQbufferSize>MAX_RQ_GROW_SIZE){this._rQbufferSize=MAX_RQ_GROW_SIZE;if(this._rQbufferSize-this.rQlen<min_fit){throw new Error("Receive Queue buffer exceeded "+MAX_RQ_GROW_SIZE+" bytes, and the new message could not fit");}}
if(resizeNeeded){const old_rQbuffer=this._rQ.buffer;this._rQ=new Uint8Array(this._rQbufferSize);this._rQ.set(new Uint8Array(old_rQbuffer,this._rQi,this._rQlen-this._rQi));}else{if(ENABLE_COPYWITHIN){this._rQ.copyWithin(0,this._rQi,this._rQlen);}else{this._rQ.set(new Uint8Array(this._rQ.buffer,this._rQi,this._rQlen-this._rQi));}}
this._rQlen=this._rQlen-this._rQi;this._rQi=0;}
_decode_message(data){const u8=new Uint8Array(data);if(u8.length>this._rQbufferSize-this._rQlen){this._expand_compact_rQ(u8.length);}
this._rQ.set(u8,this._rQlen);this._rQlen+=u8.length;}
_recv_message(e){this._decode_message(e.data);if(this.rQlen>0){this._eventHandlers.message();if(this._rQlen==this._rQi){this._rQlen=0;this._rQi=0;}}else{Log.Debug("Ignoring empty message");}}}