'use strict';

const INSTANCES = [];

class SimpleCache {
	constructor(){
		INSTANCES.push( this );
		return this.flush();
	}

	flush() {
		this.STORE = {};
		return 0;
	}

	makeKeyString( keyObj ){
		return JSON.stringify(keyObj);
	}

	read(keyObj) {
        const now = new Date();
        const key = this.makeKeyString(keyObj);
        const cachedData = this.STORE[key];
        if(cachedData == undefined) return undefined
        if(now < cachedData.expiry || cachedData.expiry == null) {
            return cachedData.data
        }
        delete this.STORE[key];
        return undefined 
    }
    
    writeWithExpiry(keyObj, payload, expiry) {
        const key = this.makeKeyString(keyObj);
        let expiryDate = new Date();
        expiryDate = new Date(expiryDate.getTime() + expiry);
        this.STORE[key] = {
            expiry: expiryDate,
            data: payload
        };
    }

	write(keyObj, payload){
        const key = this.makeKeyString(keyObj);
        this.STORE[key] = {
            expiry: null,
            data: payload
        }
		return true;
	}

	static flushAll(){
		INSTANCES.forEach( instance => { instance.flush(); })
	}
}

module.exports = SimpleCache;