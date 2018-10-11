# IdleComp
A **comp**osable way to perform *non-bloking* **comp**utations in JavaScript.

IdleComp is based on [@philipwalton](https://github.com/philipwalton)'s [Idle Until Urgent](https://philipwalton.com/articles/idle-until-urgent/) article and provide you a simple and composable way to run code on your web application without blocking user input.
The only thing you have to do is following one simple rule.

> Write small simple functions and compose they together.

## Why?
Traditionally, web browsers' javascript runs on the same single thread as other page's tasks like painting and parsing.
Meaning your code will either take long enough to blocks those tasks or be sort to, hopefully, not interfering on user experience.
While we do have other alternatives like workers, they usually are very limited and can't manipulete the DOM tree.

IdleComp takes advantege of page's idle times to executing sort tasks, providing an easy interface that allows for composition.

## Composition

A insteristing property of IdleComp is that doing this:
```javascript
IdleComp
  .of(5)
  .map(increment)
  .map(double)
```
Is equivalent to this:
```javascript
IdleComp
  .of(5)
  .map(x => double(increment(x)))
```
This mean that calling subsequents `map`s is exactly like composing functions!

## Usage

To install:
```sh
npm install --save idle-comp
#or
yarn add idle-comp
```

To create a new IdleComp object, you should use `IdleComp.of` and pass in your initial value.
```javascript
import IdleComp from 'idle-comp'

const idleFive = IdleComp.of(5)
```

Now `idleFive` is an Object with to methods: `map` and `returns`.

`map` is how we're going to do our idle computations.

```javascript
idleFive
  .map(five => five * 2)
  .map(ten => ten - 1)
  .map(console.log) // 9
```

As we're computing only when the browser is idle, this also means we're delegating your computation to some time in the future - Asynchronous.

But sometimes you will need the value rigth away, even if blocking.
This is when `returns` kicks in.

`returns` will execute all pending computation and returns the final result.

```javascript
const idleNine = idleFive
  .map(five => five * 2)
  .map(ten => ten - 1)

//Right now idleNine isn't resolved yet, let's force all computations synchronously

console.log(idleNine.returns()) // 9
```

### Example
First, lets define an dragons array.
```javascript
const dragons = [
    { age: 2, name: 'Halph' },
    { age: 5, name: 'Pottus' },
    { age: 3, name: 'Traus' },
    { age: 1, name: 'Nelf' },
    { age: 4, name: 'Gart' },
    { age: 7, name: 'Mange' },
    { age: 6, name: 'Zalu' }
]
```

Now a logging helper
```javascript
// Just log x and then return it
const log = x => {
  console.log(x)
  return x
}
```

Now lets sort the dragons by age in descending order, get the last and shout it's name
```javascript
const idleName = IdleComp
  .of(dragons) // Bring our dragons to the idle realm
  .map(dragons => dragons.sort((dA, dB) => dB.age - dA.age)) // sort them by age
  .map(dragons => dragons[6]) // get the last
  .map(log) // log out or dragon and return it
  .map(lastDragon => lastDragon.name)
  .map(name => name.toUpperCase())

console.log('First me')
console.log('Than me')

const name = idleName.returns() // Forces all remaning idles to run synchronously

console.log(name)

idleName
  .map(name => name[0]) // resumes the chain
  .map(firstLetter => firstLetter + 'ICE')
  .map(log)

console.log('end of file')
```

When this example is ran, we got the pritings
```
First me
Than me
{ age: 1, name: 'Nelf' }
NELF
end of file
NICE
```

As you see, the fisrt two `console.log`s are executed first and the executation of the first `.map(log)` (as well as the entire map chain) is deffered until we explicit request the value with `.returns()`.

As we resume the mapping chain, we deffer the rest of the execution to either the next `.returns()` or the next iddle slice of time, whatever comes first.

## Roadmap

Those are features that are on our backlog.

 - Creation of an async chainable method, that turns a IdleComp chain into asynchronous. (e.g. waits for promises to resolve value, then wait for the next idle cicle to process). [#1](https://github.com/munizart/idle-comp/issues/1)
 - Testing [#2](https://github.com/munizart/idle-comp/issues/2)
