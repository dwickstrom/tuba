const { curry, head } = require('ramda')
const Maybe = require('data.maybe')
const Task = require('data.task')
const Either = require('data.either')

// eitherToTask :: Either a -> Task a
const eitherToTask = either =>
  either.fold(Task.rejected, Task.of)

// maybeTask :: Maybe a -> Task a
const maybeToTask = maybe =>
  maybe.isNothing
  ? Task.rejected()
  : Task.of(maybe.get())

const maybeResultToTaskResult = err => maybe =>
  maybe.isNothing
  ? Task.of(err)
  : Task.of(maybe.get())

// eitherToMaybe :: Either a -> Maybe a
const eitherToMaybe = either =>
  either.fold(Maybe.Nothing, Maybe.Just)

const maybeToEither = err => maybe =>
  maybe.isNothing
  ? Either.Left(err)
  : Either.Right(maybe.get())

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
  maybeToEither,
  maybeResultToTaskResult,
  eitherToTask,
  eitherToMaybe,
}
