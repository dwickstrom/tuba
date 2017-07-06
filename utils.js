const { curry, head } = require('ramda')
const Maybe = require('data.maybe')
const Task = require('data.task')

// eitherToTask :: Either a -> Task a
const eitherToTask = either =>
  either.fold(Task.reject, Task.of)

// maybeTask :: Maybe a -> Task a
const maybeToTask = maybe =>
  maybe.isNothing
  ? Task.reject()
  : Task.of(maybe.get())

// eitherToMaybe :: Either a -> Maybe a
const eitherToMaybe = either =>
  either.fold(Maybe.Nothing, Maybe.Just)

// safeProp :: String -> {} -> Maybe a
const safeProp = curry((prop, obj) =>
  Maybe.fromNullable(obj[prop]))

// safeHead :: [a] -> Maybe a
const safeHead = aList =>
  Maybe.fromNullable(head(aList))

module.exports = {
  safeProp,
  safeHead,
  maybeToTask,
  eitherToTask,
  eitherToMaybe,
}
