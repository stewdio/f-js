

# F-js

__All your `function` are belong to `ƒ`. (Arrows too.)__  

I’ve always hated 
[JavaScript’s _Arrow Function_ expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) syntax. It’s like some weird 
[castling](https://en.wikipedia.org/wiki/Castling) move where the important components switch places for no good reason. It feels backward. Why is the `=>` (the component that arguably signifies that we are dealing with a function at all) placed _after_ the argument parentheses? 

I remember JavaScript before arrow functions even existed. It took me years to ease my skepticism of its differing `this` binding. (I’d become accustomed to `this` tricks, but since then I’ve grown to respect how arrows handle things.) I still hate the look of it, though. Like… a lot. So I took matters into my own hands. Now I can just write `ƒ` as God intended¹. (On a Mac this is accomplished by pressing __Option__ + __F__.) No more stupid arrows. And no more writing out `function` either. This is so much cleaner looking. 


##  Basic assignment
```javascript
const add = ƒ( a, b ){ return a + b }  
console.log( add( 2, 3 ))
```

##  Basic assignment sans argument parenthses
```javascript
const tick = ƒ { console.log( 'tick' )}  
tick()
```

##  Named function
```javascript
ƒ named1(){ console.log( this.name )}
```

##  Named function, sans argument parentheses
```javascript
ƒ named2 { console.log( this.name )}
```

##  Inline callback
```javascript
[ 1, 2, 3 ]
.map( ƒ( x ){ return x * 2 })
```

##  Higher-order with closure
```javascript
const times = ƒ( n, fn ){ for( let i = 0; i < n; i ++ ) fn( i )}
times( 3, ƒ( i ){ console.log( i )})
```

##  Immediately-invoked function expression (IIFE)
```javascript
const msg = ( ƒ( name ){ return `Hello, ${ name }`})( 'F-this' )
console.log( msg )
```

##  Default / rest / destructuring params
```javascript
const 
format = ƒ({ a = 1, b = 2 } = {}){ return `${ a }:${ b }`},
sum = ƒ( ...xs ){ return xs.reduce( ƒ( s, x ) s + x, 0 )}
```

##  Methods and properties
```javascript
const counter = {

	n: 0,
	increment: ƒ { this.n ++ },
	get: ƒ { return this.n }
}
```

##  Nested braces in bodies

```javascript
const pick = ƒ( obj, keys ){

	const out = {}
	for( const k of keys ){ if( k in obj ){ out[ k ] = obj[ k ]}}
	return out
}
```

##  Inline promise
```javascript
await ( async ƒ(){ return 42 })()
```

##  Inline promise sans argument parentheses
```javascript
await ( async ƒ { return 67 })()
```

##  Named inline promise
```javascript
async ƒ doWork { await new Promise( ƒ( r ){ setTimeout( r, 10 )})}
```

<br><br>


#  Try it out

```javascript
`npm start`
```


<br><br><br><br>


¹ I am an atheist. 