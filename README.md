

# F.js

__All your `function` are belong to `ƒ`. (Arrows too.)__  



I’ve never enjoyed JavaScript’s
[arrow function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) syntax. It’s like some weird 
[castling](https://en.wikipedia.org/wiki/Castling) move where the important components switch places for no good reason. It feels backward. Why is the `=>` (the component that arguably signifies that we are dealing with a function at all) placed _after_ the argument parentheses? I get that it’s supposed to look like an arrow (`→`), to resemble the workflow of transforming some input arguments into an output. But it has never sat well with me. The fact that a function is a function—that’s the important part. The act of transforming a list of arguments is only secondarily important. Argument-free functions transform _nothing._ When you craft an argument-free lambda, why on earth would you want the “arrow part” to be more typographically significant than the fact that it’s a lambda? ([Alonzo Church](https://en.wikipedia.org/wiki/Alonzo_Church) and [John McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)) are contorting in their digital graves.) We need a strong visual indicator _prefix_, not a big ugly “transform arrow” in the middle that potentially transforms _nothing_.  We need an `ƒ( x )` syntax instead.

I remember JavaScript before arrow functions even existed. (Thank you for your _amazing_ work, [Brendan](https://en.wikipedia.org/wiki/Brendan_Eich)—though every fiber of my being disagrees with your [backward stance on homosexuality](https://www.theguardian.com/technology/2014/apr/03/mozilla-ceo-brendan-eich-resigns-prop-8). It’s never too late to realize you were wrong; to evolve your thinking and come join us in the “boringly straight, clumsy but well intentioned ally” club. Please do.) When arrow functions finally arrived on the scene it took me years to ease my skepticism of this new approach to `this` binding. (I was accustomed to earlier `this` hacks. But since then I’ve grown to respect how arrows handle things. Besides, you can always use `.bind(…)` anyway.) Even though I’ve warmed to the functionality (no pun intended) of arrow functions, I still loathe the look of these two-character typographic blights, as well as their placement within the expression. So much so, that I barely use arrow functions in my own code. But writing out `function` all the time has grown so tedious… 

I’ve taken matters into my own hands. Now I can just write `ƒ` as God intended¹. (On a Mac this is accomplished by pressing __Option__ + __F__.) No more stupid arrows. And no more writing out `function` either. This is so much cleaner. 




##  One simple build step

This demo app copies the content of the `/source` folder into a `/distro` folder, automagically transforming all of your .`fjs` files into vanilla JavaScript ones with `.js` extensions. The results are served up at `http://localhost:4444`. 
```javascript
`npm start`
```

###  F.js, we’ll do it live

This demo also enables live F.js test-driving right in your JavaScript console:
```javascript
var fjsCode = `ƒ test console.log( 'Works!' )`
eval( fThis( fjsCode ))
test()
```

Or all in one go:
```javascript
eval( fThis( `ƒ test console.log( 'Works!' )` )); test()
```


<br>


##  Example F.js code

###  Basic assignment
```javascript
const add = ƒ( a, b ){ return a + b }  
console.log( add( 2, 3 ))
```

###  Basic assignment sans argument parentheses
```javascript
const tick = ƒ { console.log( 'tick' )}  
tick()
```

###  Named function
```javascript
ƒ named1(){ console.log( this.name )}
```

###  Named function sans argument parentheses
```javascript
ƒ named2 { console.log( this.name )}
```

###  Inline callback
```javascript
[ 1, 2, 3 ]
.map( ƒ( x ){ return x * 2 })
```

###  Higher-order with closure
```javascript
const times = ƒ( n, fn ){ for( let i = 0; i < n; i ++ ) fn( i )}
times( 3, ƒ( i ){ console.log( i )})
```

###  Immediately-invoked function expression (IIFE)
```javascript
const msg = ( ƒ( name ){ return `Hello, ${ name }`})( 'F-this' )
console.log( msg )
```

###  Default / rest / destructuring params
```javascript
const 
format = ƒ({ a = 1, b = 2 } = {}){ return `${ a }:${ b }`},
sum = ƒ( ...xs ){ return xs.reduce( ƒ( s, x ) s + x, 0 )}
```

###  Methods and properties
```javascript
const counter = {

	n: 0,
	increment: ƒ { this.n ++ },
	get: ƒ { return this.n }
}
```

###  Nested braces in bodies
```javascript
const pick = ƒ( obj, keys ){

	const out = {}
	for( const k of keys ){ if( k in obj ){ out[ k ] = obj[ k ]}}
	return out
}
```

###  Inline promise
```javascript
await ( async ƒ(){ return 42 })()
```

###  Inline promise sans argument parentheses
```javascript
await ( async ƒ { return 67 })()
```

###  Named inline promise
```javascript
async ƒ doWork { await new Promise( ƒ( r ){ setTimeout( r, 10 )})}
```


<br><br><br><br>



¹ I am an atheist. 