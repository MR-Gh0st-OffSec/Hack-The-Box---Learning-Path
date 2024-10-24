import*as Log from '../util/logging.js';import{isTouchDevice}from '../util/browser.js';import{setCapture,stopEvent,getPointerEvent}from '../util/events.js';const WHEEL_STEP=10;const WHEEL_STEP_TIMEOUT=50;const WHEEL_LINE_HEIGHT=19;export default class Mouse{constructor(target){this._target=target||document;this._doubleClickTimer=null;this._lastTouchPos=null;this._pos=null;this._wheelStepXTimer=null;this._wheelStepYTimer=null;this._accumulatedWheelDeltaX=0;this._accumulatedWheelDeltaY=0;this._eventHandlers={'mousedown':this._handleMouseDown.bind(this),'mouseup':this._handleMouseUp.bind(this),'mousemove':this._handleMouseMove.bind(this),'mousewheel':this._handleMouseWheel.bind(this),'mousedisable':this._handleMouseDisable.bind(this)};this.touchButton=1;this.onmousebutton=()=>{};this.onmousemove=()=>{};}
_resetDoubleClickTimer(){this._doubleClickTimer=null;}
_handleMouseButton(e,down){this._updateMousePosition(e);let pos=this._pos;let bmask;if(e.touches||e.changedTouches){if(down==1){if(this._doubleClickTimer===null){this._lastTouchPos=pos;}else{clearTimeout(this._doubleClickTimer);const xs=this._lastTouchPos.x-pos.x;const ys=this._lastTouchPos.y-pos.y;const d=Math.sqrt((xs*xs)+(ys*ys));const threshold=20*(window.devicePixelRatio||1);if(d<threshold){pos=this._lastTouchPos;}}
this._doubleClickTimer=setTimeout(this._resetDoubleClickTimer.bind(this),500);}
bmask=this.touchButton;}else if(e.which){bmask=1<<e.button;}else{bmask=(e.button&0x1)+
(e.button&0x2)*2+
(e.button&0x4)/2;}
Log.Debug("onmousebutton "+(down?"down":"up")+
", x: "+pos.x+", y: "+pos.y+", bmask: "+bmask);this.onmousebutton(pos.x,pos.y,down,bmask);stopEvent(e);}
_handleMouseDown(e){if(e.type==="mousedown"){setCapture(this._target);}
this._handleMouseButton(e,1);}
_handleMouseUp(e){this._handleMouseButton(e,0);}
_generateWheelStepX(){if(this._accumulatedWheelDeltaX<0){this.onmousebutton(this._pos.x,this._pos.y,1,1<<5);this.onmousebutton(this._pos.x,this._pos.y,0,1<<5);}else if(this._accumulatedWheelDeltaX>0){this.onmousebutton(this._pos.x,this._pos.y,1,1<<6);this.onmousebutton(this._pos.x,this._pos.y,0,1<<6);}
this._accumulatedWheelDeltaX=0;}
_generateWheelStepY(){if(this._accumulatedWheelDeltaY<0){this.onmousebutton(this._pos.x,this._pos.y,1,1<<3);this.onmousebutton(this._pos.x,this._pos.y,0,1<<3);}else if(this._accumulatedWheelDeltaY>0){this.onmousebutton(this._pos.x,this._pos.y,1,1<<4);this.onmousebutton(this._pos.x,this._pos.y,0,1<<4);}
this._accumulatedWheelDeltaY=0;}
_resetWheelStepTimers(){window.clearTimeout(this._wheelStepXTimer);window.clearTimeout(this._wheelStepYTimer);this._wheelStepXTimer=null;this._wheelStepYTimer=null;}
_handleMouseWheel(e){this._resetWheelStepTimers();this._updateMousePosition(e);let dX=e.deltaX;let dY=e.deltaY;if(e.deltaMode!==0){dX*=WHEEL_LINE_HEIGHT;dY*=WHEEL_LINE_HEIGHT;}
this._accumulatedWheelDeltaX+=dX;this._accumulatedWheelDeltaY+=dY;if(Math.abs(this._accumulatedWheelDeltaX)>WHEEL_STEP){this._generateWheelStepX();}else{this._wheelStepXTimer=window.setTimeout(this._generateWheelStepX.bind(this),WHEEL_STEP_TIMEOUT);}
if(Math.abs(this._accumulatedWheelDeltaY)>WHEEL_STEP){this._generateWheelStepY();}else{this._wheelStepYTimer=window.setTimeout(this._generateWheelStepY.bind(this),WHEEL_STEP_TIMEOUT);}
stopEvent(e);}
_handleMouseMove(e){this._updateMousePosition(e);this.onmousemove(this._pos.x,this._pos.y);stopEvent(e);}
_handleMouseDisable(e){if(e.target==this._target){stopEvent(e);}}
_updateMousePosition(e){e=getPointerEvent(e);const bounds=this._target.getBoundingClientRect();let x;let y;if(e.clientX<bounds.left){x=0;}else if(e.clientX>=bounds.right){x=bounds.width-1;}else{x=e.clientX-bounds.left;}
if(e.clientY<bounds.top){y=0;}else if(e.clientY>=bounds.bottom){y=bounds.height-1;}else{y=e.clientY-bounds.top;}
this._pos={x:x,y:y};}
grab(){if(isTouchDevice){this._target.addEventListener('touchstart',this._eventHandlers.mousedown);this._target.addEventListener('touchend',this._eventHandlers.mouseup);this._target.addEventListener('touchmove',this._eventHandlers.mousemove);}
this._target.addEventListener('mousedown',this._eventHandlers.mousedown);this._target.addEventListener('mouseup',this._eventHandlers.mouseup);this._target.addEventListener('mousemove',this._eventHandlers.mousemove);this._target.addEventListener('wheel',this._eventHandlers.mousewheel);document.addEventListener('click',this._eventHandlers.mousedisable);this._target.addEventListener('contextmenu',this._eventHandlers.mousedisable);}
ungrab(){this._resetWheelStepTimers();if(isTouchDevice){this._target.removeEventListener('touchstart',this._eventHandlers.mousedown);this._target.removeEventListener('touchend',this._eventHandlers.mouseup);this._target.removeEventListener('touchmove',this._eventHandlers.mousemove);}
this._target.removeEventListener('mousedown',this._eventHandlers.mousedown);this._target.removeEventListener('mouseup',this._eventHandlers.mouseup);this._target.removeEventListener('mousemove',this._eventHandlers.mousemove);this._target.removeEventListener('wheel',this._eventHandlers.mousewheel);document.removeEventListener('click',this._eventHandlers.mousedisable);this._target.removeEventListener('contextmenu',this._eventHandlers.mousedisable);}}