# Wanda Programming Language

Programming language for [a tutorial series on building a compiler](https://dev.to/jasonsbarr/how-to-create-your-own-programming-language-2642).

Yes, the language is named after Wanda Maximoff from Marvel comics and the MCU.

## The Language

Wanda is a simple language that compiles to JavaScript. It shares much with the semantics of JavaScript, including eager evaluation, first class functions that are closures, and prototypal objects with class syntax as a wrapper around the prototypal system. It is gradually typed, meaning you can optionally add type annotations to turn on the static type checker.

It uses s-expressions for syntax like the Lisp family of languages, and some features are similar to Clojure. I've also borrowed some features from Racket.

## Basic types

Primitive types include:

- Numbers
- Strings
- Booleans
- Nil
- Keywords

Compound types include:
- Lists (singly-linked lists)
- Vectors (arrays)
- Objects

## Forms

Expressions and special forms

### Literals

Literals include numbers, strings, booleans, nil, keywords, vector literals, and object literals:

```clojure
17
3.1415
"Hello"
true
false
nil
:hello
[1 2 3]
[1, 2, 3] ; commas are treated as whitespace
{name: "Jason", age: 43}
```

Create lists with either the `cons` or `list` function

```clojure
(cons 1 (cons 2) (cons 3 nil))
(list 1 2 3)
```

### Member expressions

You can access object and module members using dot syntax. An object can be any expression, but a property must be a valid symbol. Access properties that don't have valid symbol names using the `prop` function

```clojure
Object.member

(prop "some%property%name" {"some%property%name": "some value"})
```

### Destructuring

You can destructure lists and objects in variable assignment. You can only destructure "one level deep," which means no nested destructuring (this is due to limitations in the optimization pass of the compiler and will hopefully be fixed in the future). You can initialize a rest variable using the `&` symbol

```clojure
(def [a &b] [1 2 3]) ; a is 1, b is [2 3]
(def {name age} {name: "Jason" age: 43})
```

### Call expressions

A call expression is a simple list where the first item is the function and the rest of the items are its arguments

```clojure
(+ 1 2 3 4 5)
```

### Constant and variable declarations

Declare constants with the `def` keyword and variables with `var`

```clojure
(def x 10)
(var y 5)
```

You can change the value of a variable with a `set!` expression (trying to change a constant will result in an error)

```clojure
(set! y 7)
```

### Function declarations and lambda expressions

Declare functions with the `def` keyword

```clojure
(def add-2 (a b)
    (+ a b))
```

Declare a variadic function (variable number of parameters) by prepending `&` to the rest argument. The rest variable will be collected into the function body as a list

```clojure
(def sum (&nums)
    (fold (lambda (s i) (+ s i)) nums))
```

For one-off functions use the `lambda` keyword, as shown above

### Do blocks

Group multiple expressions with the `do` keyword. The block evaluates to the value of the last expression

```clojure
(do
    (var x 10)
    (+ x 3))
```

### Branching

Use the `if` keyword for a branching expression. Put the condition in the first clause, the consequent in the 2nd clause, and the alternate in the 3rd clause

```clojure
(if (< n 19)
    (println "You cannot vote")
    (println "You can vote"))
```

### Iteration

Use the `for` keyword for iteration. Follow `for` with the operator, then initializers, and then the body. You can include multiple expressions in the body as if it started with `do`

```clojure
(for map ((i (range 5)))
    (+ i i))
```

Current operators in Wanda include each, map, filter, fold, and fold-r, but you can also define your own for operators by creating functions. They should be higher-order functions that take a function callback as the first argument, and the callback argument should take a parameter for each variable. Then the rest of the main function's arguments should be the initializers for the callback's parameters.

Here's an example implementation of `map`:

```clojure
(def map (fn lst)
    (if (nil? lst)
    lst
    (cons (fn (head lst) (map fn (tail lst))))))
```
