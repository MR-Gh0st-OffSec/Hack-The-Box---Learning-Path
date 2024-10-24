export default class EventTargetMixin{constructor(){this._listeners=new Map();}
addEventListener(type,callback){if(!this._listeners.has(type)){this._listeners.set(type,new Set());}
this._listeners.get(type).add(callback);}
removeEventListener(type,callback){if(this._listeners.has(type)){this._listeners.get(type).delete(callback);}}
dispatchEvent(event){if(!this._listeners.has(event.type)){return true;}
this._listeners.get(event.type).forEach(callback=>callback.call(this,event));return!event.defaultPrevented;}}