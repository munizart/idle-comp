var IdleComp = require('../lib')

var dragons = [
  { age: 2, name: 'Halph' },
  { age: 5, name: 'Pottus' },
  { age: 3, name: 'Traus' },
  { age: 1, name: 'Nelf' },
  { age: 4, name: 'Gart' },
  { age: 7, name: 'Mange' },
  { age: 6, name: 'Zalu' }
]

/**
 * Just log x and then return it
 * @param { a } x value to log
 * @return { a } the logged value
 * @template a
 */
var log = (x) => {
  console.log(x)
  return x
}

var idleName = IdleComp
  .of(dragons) // Bring our dragons to the idle realm
  .map(dragons => dragons.sort((dA, dB) => dB.age - dA.age)) // sort them by age
  .map(dragons => dragons[6]) // get the last
  .map(log) // log out or dragon and return it
  .map(lastDragon => lastDragon.name)
  .map(name => name.toUpperCase())

console.log('First me')
console.log('Than me')

var name = idleName.fold() // Forces all remaning idles to run synchronously

console.log(name)

idleName
  .map(name => name[0]) // resumes the chain
  .map(firstLetter => firstLetter + 'ICE')
  .map(log)

console.log('end of file')
