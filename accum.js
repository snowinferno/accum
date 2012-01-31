exports.createAccum = function( props, cb ){
	var obj = {} // create a blank object with no properties so we can fill it with just the properties we need
	obj.cb = cb; // store a reference to the callback
	obj.propList = props; // store a list of properties that were set to check with the finalize method
	obj.isFinished = false;
	do{
		// add a property to a new object for each property passed in the array props
		obj[props.shift()] = undefined; // define each property to be undefined explicitly
	} while( props.length > 0 );
	obj.finalize = function(){
		// method to call each time one of these properties gets modified
		var isFinished = true, // assume it is finished
			objProps = this.propList; // mutable copy of the property list, we don't want to check properties not associated with whether or not this is finished.
		do{
			var prop = objProps.shift(); // test each property in the list and if any are left undefined, we aren't finished
			if( this.hasOwnProperty( prop ) && this[prop] == undefined ){
				isFinished = false;
			}
		} while( objProps.length > 0 );
		if( this.cb && isFinished ){ this.cb( this ); } // if we're finished and a callback was specified, send the object on to the callback
		else { this.isFinished = isFinished; } // if no callback is defined, update the object's finished property to let the programmer test on their own.
	}
	return obj; // return the new accumulator object.
}