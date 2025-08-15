

# ƒ.js

__All your `function` are belong to `ƒ`. (Arrows too.)__  

Declare your JavaScript functions with a single `ƒ` character. No more typing out the full eight characters of “`function`.” And no more awkward-looking [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) either. Just crisp, clean, beautiful [`ƒ` notation](https://en.wikipedia.org/wiki/%C6%91#Italic): 

```javascript
ƒ add( a, b ) a + b
```

All of the shortcut goodies of arrows. None of the nasties. No more gross “`=()=>`” snippets muddying up your argument-free [lamba functions](https://en.wikipedia.org/wiki/Anonymous_function). Why include parentheses at all? Here’s how __ƒ.js__ does it:

```javascript
counter.increment = ƒ { this.n ++ }
```
Your JavaScript never felt so clean.




<br><br><br>




##  Yelling at clouds

I’ve never enjoyed JavaScript’s
[arrow function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) syntax. It’s like some weird 
[castling move](https://en.wikipedia.org/wiki/Castling) where the important components switch places for no good reason. Consider the following comparison. Here’a a traditional function expression with assignment:

```javascript
var add = function( a, b ){ return a + b }
```

And here’s the arrow function version:

```javascript
var add = ( a, b ) => a + b
```

While there are some nice parsing aspects to arrow functions—including the implicit `return` when the function definition is a single line and uses no curly braces—the form of the definition feels _visually shuffled._ Why is the `=>` (the component that signals this is a function) placed _after_ the argument parentheses? I get that it’s supposed to look like an arrow (`→`), to resemble the workflow of transforming some input arguments into an output. I get that someone thought that was clever. But it has never sat well with me. I don’t need that argument-transformation metaphor in my life. The fact that a function _is a function_ at all—_that’s_ the important part. The act of transforming a list of arguments is only secondarily important. Here’s how we can rewrite the above with __ƒ.js__:
```javascript
var add = ƒ( a, b ) a + b
```

And if you’re open to [declaring named functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#function_declarations), it gets even simpler:

```javascript
ƒ add( a, b ) a + b
```
Doesn’t that read beautifully? You know it does. You know you’re intrigued. Perhaps you’re a little bit frightened—but you still want to know more!




###  Look Ma, no arguments

Arrow functions really show their ick when it comes to argument-free function expressions. In these cases the parentheses and “arrows” [typographically](https://en.wikipedia.org/wiki/Typography) visualize transforming _absolutely nothing at all:_ 

```javascript
var sayHello = () => console.log( 'Hello' )
```

What on earth is this “`=()=>`” fragment? When you craft an argument-free lambda, why would you want the “arrow part” to be more typographically significant than the fact that it’s a lambda? ([Alonzo Church](https://en.wikipedia.org/wiki/Alonzo_Church) and [John McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)) are contorting in their digital graves.) We need a strong visual indicator _prefix_ to the function’s argument list and content, not a big ugly “transform arrow” in between the parentheses and content — that visually represents the transformation of _nothing_. This is crazy. We need the sanity of __ƒ.js__. See how much _cleaner_ this is?

```javascript
ƒ sayHello console.log( 'Hello' )
```




###  Shake harder, son

I remember JavaScript before arrow functions even existed. (Thank you for your _amazing_ work, [Brendan](https://en.wikipedia.org/wiki/Brendan_Eich)—though every fiber of my being disagrees with your [backward stance on homosexuality](https://www.theguardian.com/technology/2014/apr/03/mozilla-ceo-brendan-eich-resigns-prop-8). It’s never too late to realize you were wrong; to evolve your thinking and come join us in the “boringly straight, clumsy but well intentioned ally” club. Please do.) When arrow functions finally arrived on the scene it took me years to ease my skepticism of this new approach to `this` binding. (I was accustomed to earlier `this` hacks. But since then I’ve grown to respect how arrows handle things. Besides, you can always use `.bind(…)` anyway.) Even though I’ve warmed to the functionality (no pun intended) of arrow functions, I still loathe the look of these two-character typographic blights, as well as their placement within the expression. So much so, that I barely use arrow functions in my own code. But writing out `function` all the time has grown so tedious… 


<br>


##  ƒ this

I’ve taken matters into my own hands. Now I can just type [`ƒ` for “function” as God intended](https://en.wikipedia.org/wiki/%C6%91#Italic)¹. (On a Mac this is accomplished by pressing __Option__ + __F__.) No more stupid arrows. And no more writing out `function` either. This is so much cleaner. 


###  One build step

This demo app copies the content of the `/source` folder into a `/distro` folder, automagically transforming all of your .`fjs` files into vanilla JavaScript ones with `.js` extensions. The results are served up at `http://localhost:4444`. 
```javascript
`npm start`
```

###  `fThis`, we’ll do it live

This demo also enables live __ƒ.js__ test-driving right in your JavaScript console:
```javascript
var fjsCode = `ƒ test console.log( 'Works!' )`
eval( fThis( fjsCode ))
test()
```

Or all in one go:
```javascript
eval( fThis( `ƒ test console.log( 'Works!' )` )); test()
```

DId you make it this far in the `README`? Wondering why there’s no __ƒ.js__ [Babel plugin](https://babeljs.io/)? It’s because _you_ haven’t submitted a PR for one yet. ([Fork __ƒ.js__ here](https://github.com/stewdio/f-js/fork).)




<br>




##  ƒ.js examples

Let’s have a look at a full battery of example use cases. Declarations. Expressions. Named. Lambdas. Arguments. No arguments. Nestings. Closures. We got it all, baby!

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
² Folks who are concerned by my use of `var` in some of the examples above(instead of `const` or `let`) may be ignorant to the joys of [function scope](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#scoping_with_let_and_const), which is of course the standard for `function` declarations. Plus `var` lets you redeclare to your heart’s content, which means no errors when repeatedly pasting code snippets directly into your console. Sure, go ahead and use `const` and `let` for “interior code.” But for fast [REPL](https://en.wikipedia.org/wiki/Read–eval–print_loop) pasting, isn’t `var` friendlier to the paster? 