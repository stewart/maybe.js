# maybe.js

This library contains a JS implementation of the [Maybe monad][].

It's a bit more flexible, and comes with a few more extras than the Haskell implementation, given JavaScript's type system limitations and the language's general flexibiity.

[Maybe monad]: https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad

## Installation

If you're intending to use this library from Node, you can just install it with NPM:

    $ npm install --save maybe-js

For other environments, you can just grab `maybe.js` or `maybe.min.js` directly.

Both will work with AMD, Node, or directly in the browser.

## Why

`null` sucks.
`undefined` sucks.
Checking for either of them sucks.

Why not make things a bit easier?

## Usage

The tour:

```javascript
var object = {
  attr: "hello",
  fn: function() {
    return this.attr + " world!";
  }
};

var wrapped = maybe(object);
// => Maybe([object Object])

wrapped.value;
// => object

wrapped.get("attr");
// => Maybe(hello)

wrapped.bind("fn");
// => Maybe(hello world!)

wrapped.get("invalid_attr")
// => Maybe(empty)

wrapped.bind("invalid_fn")
// => Maybe(empty)

wrapped("attr");
// => Maybe(hello)

wrapped("fn");
// => Maybe(hello world!)

wrapped.tap(function(x) {
  x.attr = "bye"
}).get("attr");
// => Maybe(bye)

maybe().or("hello");
// => Maybe(hello)

maybe().or(function() { return "generated value"; });
// => Maybe(generated value)

maybe("hello").isNothing(); // => false
maybe().isNothing();        // => true

maybe("hello").isValue(); // => true
maybe().isValue();        // => false

maybe.nothing;
// => Maybe(empty)

var stringify = maybe.lift(JSON.stringify)
stringify([1, 2, 3]);
// => Maybe([1,2,3])
```

#### `maybe(value)`

Wraps `value` in a Maybe.

If `value` is undefined, the Maybe is said to be empty.

```javascript
var value = "hello";
maybe(value);
// => Maybe(hello)

maybe();
// => Maybe(empty)
```

#### `maybe(value).value`

Returns the value stored in the Maybe.

```javascript
maybe("hello").value;
// => "hello"

maybe().value;
// => undefined
```

#### `maybe(value).get(key)`

Accesses a property on a Maybe, returning a new Maybe encapsulating the property.
If no value is present, an empty Maybe is returned.

```javascript
var obj = { attr: "hello" };
maybe(obj).get("attr");
// => Maybe(hello);

maybe(obj).get("not_an_attr");
// => Maybe(empty);
```

#### `maybe(value).bind(fn, ...args)`

Calls a function on a Maybe's value.
The return value is wrapped in another Maybe.

`fn` may be a `Function`, or a `String`.
If it's a String, it's assumed to be a instance function of the value.
If it's a Function, it's called with the Maybe's value prepending other arguments.

If an instance function isn't present, an empty Maybe is returned.

```javascript
var obj = {
  fn: function() { return "return value"; }
};

function toString(thing) {
  return Object.prototype.toString.call(thing);
}

var wrapped = maybe(obj);

wrapped.bind(toString);
// => Maybe([object Object])

wrapped.bind("fn");
// => Maybe(return value)

wrapped.bind("not_a_fn");
// => Maybe(empty)
```

#### `maybe(opt, ...args)`

A shorthand for both of the above.

If a function, or a string property name that resolves to a function, the function will be called.

Otherwise, will attempt to return a wrapped property.

```javascript
var obj = {
  attr: "hi",
  fn: function() { return "return value"; }
};

function toString(thing) {
  return Object.prototype.toString.call(thing);
}

var wrapped = maybe(obj);

wrapped("attr");
// => Maybe(hi)

wrapped("fn");
// => Maybe(return value)

wrapped(toString);
// => Maybe([object Object])

wrapped("not_a_property");
// => Maybe(empty)
```

#### `maybe(value).tap(fn, thisArg)`

Yields the Maybe's value for modification.
Returns a Maybe with the modified value.

Support an optional argument that will be the `this` value in the function.

```javascript
var obj = {
  attr: "hello"
};

maybe(obj).tap(function(x) {
  x.attr += " world!";
}).get("attr");
// => Maybe(hello world!)
```

#### `maybe(value).or(alternate)`

If a Maybe is empty, returns a new Maybe with the specified value.

```javascript
maybe(undefined).or("new value");
// => Maybe(new value)
```

#### `maybe(value).isNothing()`

Checks if the Maybe is empty or not.
Returns a boolean.

```javascript
maybe("thing").isNothing()   // => false
maybe(undefined).isNothing() // => true
```

#### `maybe(value).isValue()`

Checks if the Maybe has a value or not.
Returns a boolean.

```javascript
maybe("thing").isValue()   // => true
maybe(undefined).isValue() // => false
```

#### `maybe.nothing`

An empty Maybe.

#### `maybe.lift(fn)`

Wraps a function such that its return value becomes a Maybe.

```javascript
var stringify = maybe.lift(JSON.stringify)
stringify([1, 2, 3]);
// => Maybe([1,2,3])
```

## License

MIT. For more details, see the `LICENSE` file.
