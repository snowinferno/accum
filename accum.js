exports.createAccum = function( props, cb ){
	var obj = {} // create a blank object with no properties so we can fill it with just the properties we need
	obj.cb = cb; // store a reference to the callback
	obj.propList = props; // store a list of properties that were set to check with the finalize method
	obj.isFinished = false;

	// add a property to a new object for each property passed in the array props
	for( var i = 0; i < props.length; i++ ){
		obj[props[i]] = undefined; // define each property to be undefined explicitly
	}

	obj.finalize = function(){
		// method to call each time one of these properties gets modified
		var isFinished = true; // assume it is finished
		for( var i = 0; i < this.propList.length; i++ ){
			if( this[this.propList[i]] === undefined ){
				isFinished = false;
			}
		}

		if( this.cb && isFinished ){ this.cb( this ); } // if we're finished and a callback was specified, send the object on to the callback
		else { this.isFinished = isFinished; } // if no callback is defined, update the object's finished property to let the programmer test on their own.
	}
	return obj; // return the new accumulator object.
}