var util = require( 'util' ),
	events = require( 'events' );

function Accum( props, cb ){
	this.cb = cb; // store a reference to the callback
	this.__propList = props; // store a list of properties that were set to check with the finalize method
	this.isFinished = false;

	// add a property to a new object for each property passed in the array props
	for( var i = 0; i < props.length; i++ ){
		this[props[i]] = undefined; // define each property to be undefined explicitly
	}

	this.on( 'complete', cb );

/*	this.finalize = function(){
		// method to call each time one of these properties gets modified
		var isFinished = true; // assume it is finished
		for( var i = 0; i < this.propList.length; i++ ){
			if( this[this.__propList[i]] === undefined ){
				isFinished = false;
			}
		}

		this.isFinished = isFinished;

		if( this.cb && isFinished ){ this.cb( this ); } // if we're finished and a callback was specified, send the object on to the callback
	}*/
	events.EventEmitter.call( this ); // call the parent constructor
}

util.inherits( Accum, events.EventEmitter ); // inherit the methods from EventEmitter

Accum.prototype.add = function( key, data ){
	this[key] = data;
	var isFinished = true; // assume it is finished
	for( var i = 0; i < this.__propList.length; i++ ){
		if( this[this.__propList[i]] === undefined ){
			isFinished = false;
		}
	}

	this.isFinished = isFinished;

	if( isFinished ){
		this.emit( 'complete', this );
	}
}

exports.Accum = Accum; // export the constructor