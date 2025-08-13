import fThis from './f-this.js'




async function examplesFJS(){


	//  Basic assignment.

	const add = (( a, b ) => { return a + b })
	console.log( add( 2, 3 ))


	//  Basic assignment sans argument parentheses.

	const tick = (() => { console.log( 'tick' )})
	tick()


	//  Named function.

	var named1 = () => { console.log( this.name )};


	//  Named function sans argument parentheses.

	var named2 = () => { console.log( this.name )};


	//  Inline callback.

	[ 1, 2, 3 ]
	.map( (( x ) => { return x * 2 }))


	//  Higher-order with closure.

	const times = (( n, fn ) => { for( let i = 0; i < n; i ++ ) fn( i )})
	times( 3, (( i ) => { console.log( i )}))


	//  Immediately-invoked function expression (IIFE).

	const msg = ( (( name ) => { return `Hello, ${ name }`}))( 'F-This' )
	console.log( msg )


	//  Default / rest / destructuring params.

	const 
	format = (({ a = 1, b = 2 } = {}) => { return `${ a }:${ b }`}),
	sum = (( ...xs ) => { return xs.reduce( (( s, x ) => s + x), 0 )})
	

	//  Methods and properties.

	const counter = {
	
		n: 0,
		increment: (() => { this.n ++ }),
		get: (() => { return this.n })
	}


	//  Nested braces in bodies.

	const pick = (( obj, keys ) => {
	
		const out = {}
		for( const k of keys ){ if( k in obj ){ out[ k ] = obj[ k ]}}
		return out
	})


	//  Inline promise.

	await ((async () => { return 42 }))()

	
	//  Inline promise sans argument parentheses.

	await ((async () => { return 67 }))()


	//  Named inline promise.var doWork = async () => { await new Promise( (( r ) => { setTimeout( r, 10 )}))};
}




//  Purely for JavaScript console fun…

window.exampleFJS = examplesFJS
//  There’s no point in outputting this next command line
//  as a demonstration of coding in FJS
//  because it will have already been converted to JS!
// console.log( 'exampleFJS', exampleFJS.toString() )

window.fThis = fThis
console.log( `\n\nAll of your .fjs files will be automagically converted to vanilla JavaScript with .js extensions. And you can also test drive f.js right here in the console:

	var fjsCode = \`ƒ test console.log( 'Works!' )\`
	eval( fThis( fjsCode ))
	test()


Or all in one go:

	eval( fThis( \`ƒ test console.log( 'Works!' )\` )); test()\n\n` )





export default exampleFJS