import TightDecoder from './tight.js';export default class TightPNGDecoder extends TightDecoder{_pngRect(x,y,width,height,sock,display,depth){let data=this._readData(sock);if(data===null){return false;}
display.imageRect(x,y,width,height,"image/png",data);return true;}
_basicRect(ctl,x,y,width,height,sock,display,depth){throw new Error("BasicCompression received in TightPNG rect");}}