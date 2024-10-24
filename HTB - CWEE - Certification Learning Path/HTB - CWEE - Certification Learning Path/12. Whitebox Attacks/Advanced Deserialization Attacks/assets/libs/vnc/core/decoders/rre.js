export default class RREDecoder{constructor(){this._subrects=0;}
decodeRect(x,y,width,height,sock,display,depth){if(this._subrects===0){if(sock.rQwait("RRE",4+4)){return false;}
this._subrects=sock.rQshift32();let color=sock.rQshiftBytes(4);display.fillRect(x,y,width,height,color);}
while(this._subrects>0){if(sock.rQwait("RRE",4+8)){return false;}
let color=sock.rQshiftBytes(4);let sx=sock.rQshift16();let sy=sock.rQshift16();let swidth=sock.rQshift16();let sheight=sock.rQshift16();display.fillRect(x+sx,y+sy,swidth,sheight,color);this._subrects--;}
return true;}}