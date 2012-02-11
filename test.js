var acc = require('./accum');

var test = new acc.Accum( ['a', 'b'], function( data ){
	console.log( "We're finished!" + this.a + "\t" + this.b );
});

test.a = 1;
test.finalize();
console.log( test );
test.b = 3;
console.log( test );
test.finalize();

console.dir(test);