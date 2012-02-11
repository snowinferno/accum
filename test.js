var acc = require('./accum');

var test = new acc.Accum( ['a', 'b'], function( data ){
	console.log( "We're finished!" + this.a + "\t" + this.b );
});

test.on( 'complete', function(){
	console.log( "Event 'Complete' fired.");
	console.dir( arguments );
})

test.add( 'a', 1 );
console.log( test );
test.add( 'b', 3 );
console.log( test );
console.dir(test);