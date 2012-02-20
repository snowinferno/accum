var util = require( 'util' ),
	events = require( 'events' );

function Accum( props, cb ){
	this.initialize(props);

	// If a callback was given, treat it as an event listener for the 'complete' event
	if( undefined !== ( typeof cb ) ){
		this.__cb = cb;
		this.on( 'complete', this.__cb );
	}

	events.EventEmitter.call( this ); // call the parent constructor
}

util.inherits( Accum, events.EventEmitter ); // inherit the methods from EventEmitter

Accum.prototype.add = function( key, data ){
	if( ! (key in this.__propList) ){
		throw new ReferenceError( "Attempt to add value to unexpected property." );
	}

	this[key] = data;
	var isFinished = true; // assume it is finished
	for( var i = 0; i < this.__propList.length; i++ ){
		if( this[this.__propList[i]] === undefined ){
			// if any of the properties we're told about are still undefined, we're not finished.
			// As soon as we know we're not finished, there is no need to continue the loop.
			isFinished = false;
			break;
		} else { continue; } // if this property is defined, continue the loop
	}

	this.isFinished = isFinished;

	if( isFinished ){
		this.emit( 'complete', this );
	}
}

Accum.prototype.initialize = function( properties ){
	this.__propList = properties; // store a list of properties that were set to check with the finalize method
	this.isFinished = false;

	var propObj = {};

	// add a property to a new object for each property passed in the array props
	for( var i = 0; i < properties.length; i++ ){
		this[properties[i]] = undefined; // define each property to be undefined explicitly
		propObj[properties[i]] = true;
	}
	this.__propList = propObj;
}

Accum.prototype.reset = function(){
	// reset the accumulator for reuse with the same properties and callback
	for( var i = 0; i < this.__propList.length; i++ ){
		delete this[this.__propList[i]];
	}
}

Accum.prototype.repurpose = function( props, cb ){
	var orig_cb = false;
	// remove the properties, event, and propList
	this.reset();
	this.__propList = props;
	if( undefined !== ( typeof this.__cb ) ){
		orig_cb = true;
		this.removeListener('complete', this.__cb);
		delete this.__cb;
	}

	// initialize for the new accumulator properties and callback.
	this.initialize(props);
	if( undefined !== ( typeof cb ) ){
		// replace the original complete listener with the new one or add the new one to the end of the chain
		this.__cb = cb;
		if( orig_cb ){ // we had an initial complete listener, add the new one to the front of the chain
			this.listeners( 'complete' ).unshift( this.__cb );
		} else {
			this.on( 'complete', this.__cb );
		}
	}
}

exports.Accum = Accum; // export the constructor