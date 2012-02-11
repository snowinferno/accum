var acc = require('./accum');

var test = new acc.Accum( ['a', 'b'], function( data ){
	console.log( "We're finished!\n" + this.a + "\t" + this.b );
});

test.on( 'complete', function(){
	console.log( "Event 'Complete' fired.");
})

test.add( 'a', 1 );
test.add( 'b', 3 );
console.dir(test);

test.reset();
test.add( 'a', 2 );
test.add( 'b', 9 );
console.dir(test);

test.repurpose( ['c', 'd'], function( data ){
	console.log( 'Accumulation complete: c=' + data.c + '; d=' + data.d );
});
test.add( 'c', 4 );
test.add( 'd', 'dee de-dee' );
console.dir( test );

try{
	test.add( 'e', 'Woo!' );
} catch( e ){
	console.error( e.message );
}