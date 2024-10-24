import*as Log from '../util/logging.js';export default class HextileDecoder{constructor(){this._tiles=0;this._lastsubencoding=0;}
decodeRect(x,y,width,height,sock,display,depth){if(this._tiles===0){this._tiles_x=Math.ceil(width/16);this._tiles_y=Math.ceil(height/16);this._total_tiles=this._tiles_x*this._tiles_y;this._tiles=this._total_tiles;}
while(this._tiles>0){let bytes=1;if(sock.rQwait("HEXTILE",bytes)){return false;}
let rQ=sock.rQ;let rQi=sock.rQi;let subencoding=rQ[rQi];if(subencoding>30){throw new Error("Illegal hextile subencoding (subencoding: "+
subencoding+")");}
const curr_tile=this._total_tiles-this._tiles;const tile_x=curr_tile%this._tiles_x;const tile_y=Math.floor(curr_tile/this._tiles_x);const tx=x+tile_x*16;const ty=y+tile_y*16;const tw=Math.min(16,(x+width)-tx);const th=Math.min(16,(y+height)-ty);if(subencoding&0x01){bytes+=tw*th*4;}else{if(subencoding&0x02){bytes+=4;}
if(subencoding&0x04){bytes+=4;}
if(subencoding&0x08){bytes++;if(sock.rQwait("HEXTILE",bytes)){return false;}
let subrects=rQ[rQi+bytes-1];if(subencoding&0x10){bytes+=subrects*(4+2);}else{bytes+=subrects*2;}}}
if(sock.rQwait("HEXTILE",bytes)){return false;}
rQi++;if(subencoding===0){if(this._lastsubencoding&0x01){Log.Debug("     Ignoring blank after RAW");}else{display.fillRect(tx,ty,tw,th,this._background);}}else if(subencoding&0x01){display.blitImage(tx,ty,tw,th,rQ,rQi);rQi+=bytes-1;}else{if(subencoding&0x02){this._background=[rQ[rQi],rQ[rQi+1],rQ[rQi+2],rQ[rQi+3]];rQi+=4;}
if(subencoding&0x04){this._foreground=[rQ[rQi],rQ[rQi+1],rQ[rQi+2],rQ[rQi+3]];rQi+=4;}
display.startTile(tx,ty,tw,th,this._background);if(subencoding&0x08){let subrects=rQ[rQi];rQi++;for(let s=0;s<subrects;s++){let color;if(subencoding&0x10){color=[rQ[rQi],rQ[rQi+1],rQ[rQi+2],rQ[rQi+3]];rQi+=4;}else{color=this._foreground;}
const xy=rQ[rQi];rQi++;const sx=(xy>>4);const sy=(xy&0x0f);const wh=rQ[rQi];rQi++;const sw=(wh>>4)+1;const sh=(wh&0x0f)+1;display.subTile(sx,sy,sw,sh,color);}}
display.finishTile();}
sock.rQi=rQi;this._lastsubencoding=subencoding;this._tiles--;}
return true;}}